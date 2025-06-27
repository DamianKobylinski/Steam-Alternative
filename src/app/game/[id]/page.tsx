"use server";

import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { MoveLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import CartAdd from "../CartAdd";

export default async function Game({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const hostname = headersList.get("x-forwarded-host");

  const { userId } = await auth().catch(() => ({ userId: null }));

  const prisma = new PrismaClient();
  const id = (await params).id;

  const game = await prisma.games.findUnique({
    where: {
      game_id: Number(id),
    },
  });

  const check_if_in_library = userId
    ? await prisma.library.findFirst({
        where: {
          user_id: userId,
          game_id: Number(id),
        },
      })
    : null;

  const check_if_in_wishlist = userId
    ? await prisma.wishlist.findFirst({
        where: {
          user_id: userId,
          game_id: Number(id),
        },
      })
    : null;

  const check_if_in_salary = await prisma.salary.findFirst({
    where: {
      game_id: Number(id),
    },
  });

  return (
    <div className="p-10">
      <Link
        href={
          referer === "http://" + hostname + "/"
            ? "/"
            : referer == "http://" + hostname + "/library"
            ? "/library"
            : referer == "http://" + hostname + "/wishlist"
            ? "/wishlist"
            : "/shop"
        }
        className="flex gap-5 text-[#2292ee] text-2xl py-5 hover:translate-x-2 transition-transform"
      >
        <MoveLeft size={32} />
        {referer == "http://" + hostname + "/" ? (
          <>Return to Home</>
        ) : referer == "http://" + hostname + "/library" ? (
          <>Return to Library</>
        ) : referer == "http://" + hostname + "/wishlist" ? (
          <>Return to Wishlist</>
        ) : (
          <>Return to Shop</>
        )}
      </Link>
      <div
        style={{
          backgroundImage: `url(${game?.bg_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-[600px] w-full bg-indigo-50 rounded-xl"
      ></div>
      <div className="absolute top-[375px] lg:ml-12 ">
        <div className="flex flex-col">
          <div
            style={{
              backgroundImage: `url(${game?.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="h-96 w-72 bg-indigo-50 rounded-xl"
          ></div>
          <div className="flex flex-col place-items-start lg:flex-row lg:place-items-center gap-10 my-4">
            <p className="text-4xl my-4 text-white">{game?.title}</p>
            <div className="flex flex-col gap-5">
              <p>Release date: {game?.release_date?.toLocaleDateString()}</p>
              <p>Developer: {game?.developer}</p>
              <p>Publisher: {game?.publisher}</p>
            </div>
          </div>
          <div className="flex gap-5">
            <Badge variant={"default"}>{game?.genre}</Badge>
            <Badge variant={"default"}>{game?.platform}</Badge>
          </div>
          <div className="flex gap-5 mt-5">
            {game && (
              <SignedIn>
                <CartAdd
                  check_if_in_library={check_if_in_library}
                  check_if_in_salary={check_if_in_salary}
                  check_if_in_wishlist={check_if_in_wishlist}
                  game={{ ...game, price: Number(game.price) }}
                />
              </SignedIn>
            )}
            <SignedOut>
              <SignInButton>
                <button className="text-2xl bg-red-500 rounded-xl px-14 py-4">
                  Sign in to buy!
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className="mt-6">
          <p className="w-3/4 lg:w-3/4">{game?.description}</p>
        </div>
      </div>
    </div>
  );
}
