"use server";

import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import CartAdd from "../CartAdd";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (isNaN(gameId)) notFound();

  const headersList = headers();
  const referer = (await headersList).get("referer");
  const hostname =
    (await headersList).get("x-forwarded-host") ||
    (await headersList).get("host");

  const { userId } = await auth();

  // Run all database queries in parallel — super fast
  const [game, libraryEntry, wishlistEntry, salaryInfo] = await Promise.all([
    prisma.games.findUnique({
      where: { game_id: gameId },
      select: {
        game_id: true,
        title: true,
        bg_image: true,
        image_url: true,
        release_date: true,
        developer: true,
        publisher: true,
        genre: true,
        platform: true,
        description: true,
        price: true,
        prod_id: true,
      },
    }),

    userId
      ? prisma.library.findFirst({
          where: { user_id: userId, game_id: gameId },
          select: { id: true },
        })
      : null,

    userId
      ? prisma.wishlist.findFirst({
          where: { user_id: userId, game_id: gameId },
          select: { id: true },
        })
      : null,

    prisma.salary.findFirst({
      where: { game_id: gameId },
    }),
  ]);

  if (!game) notFound();

  // Smart "Back" button logic
  const getBackUrl = () => {
    if (!referer || !hostname) return "/shop";
    const url = new URL(referer);
    if (url.hostname !== hostname) return "/shop";

    const path = url.pathname;
    if (path === "/") return "/";
    if (path === "/library") return "/library";
    if (path === "/wishlist") return "/wishlist";
    return "/shop";
  };

  const backUrl = getBackUrl();

  return (
    <div className="p-4 md:p-6 lg:p-10 min-h-screen w-full">
      {/* Back Button */}
      <Link
        href={backUrl}
        className="inline-flex items-center gap-2 md:gap-3 text-[#2292ee] text-lg md:text-2xl py-3 md:py-5 hover:translate-x-2 transition-transform"
      >
        <MoveLeft size={24} className="md:w-8 md:h-8" />
        {backUrl === "/" && "Return to Home"}
        {backUrl === "/library" && "Return to Library"}
        {backUrl === "/wishlist" && "Return to Wishlist"}
        {backUrl === "/shop" && "Return to Shop"}
      </Link>

      {/* Hero Background */}
      <div
        style={{
          backgroundImage: `url(${game.bg_image || "/placeholder-bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] w-full rounded-xl overflow-hidden"
      ></div>

      {/* Game Cover + Info Overlay */}
      <div className="p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center lg:items-start lg:flex-row gap-6 lg:gap-8">
          {/* Cover Image */}
          <div
            style={{
              backgroundImage: `url(${
                game.image_url || "/placeholder-cover.jpg"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="h-64 w-48 sm:h-72 sm:w-56 md:h-80 md:w-64 lg:h-96 lg:w-72 rounded-xl shadow-2xl border-4 border-white/20 flex-shrink-0"
          />

          {/* Game Info */}
          <div className="flex-1 text-white text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              {game.title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-lg mb-8">
              <div>
                <p className="text-white/70">Release Date</p>
                <p className="text-xl">
                  {game.release_date?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) || "TBA"}
                </p>
              </div>
              <div>
                <p className="text-white/70">Developer</p>
                <p className="text-xl">{game.developer || "Unknown"}</p>
              </div>
              <div>
                <p className="text-white/70">Publisher</p>
                <p className="text-xl">{game.publisher || "Unknown"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {game.genre}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {game.platform}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center lg:justify-start">
              <SignedIn>
                <CartAdd
                  game={{
                    ...game,
                    price: Number(game.price ?? 0),
                    prod_id: (game as any).prod_id ?? 0,
                    take_a_look: (game as any).take_a_look ?? false,
                  }}
                  check_if_in_library={libraryEntry ? { id: libraryEntry.id, game_id: String(gameId), user_id: userId ? Number(userId) : 0 } : null}
                  check_if_in_salary={salaryInfo ? { id: salaryInfo.id, game_id: String(salaryInfo.game_id), percent_of_bargain: Number(salaryInfo.percent_of_bargain), discount_code: salaryInfo.discount_code ?? '' } : null}
                  check_if_in_wishlist={wishlistEntry ? { id: wishlistEntry.id, game_id: gameId, user_id: userId ?? '' } : null}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-2xl bg-red-600 hover:bg-red-700 text-white rounded-xl px-10 py-5 font-bold transition">
                    Sign in to Buy
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto mt-12 text-lg leading-relaxed text-muted-foreground">
        <p>{game.description || "No description available."}</p>
      </div>
    </div>
  );
}
