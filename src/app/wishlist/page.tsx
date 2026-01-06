import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FC } from "react";

const Wishlist: FC = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const get_user_wishlist = await prisma.wishlist.findMany({
    where: {
      user_id: userId,
    },
  });

  const wishlist = await prisma.games.findMany({
    where: {
      game_id: {
        in: get_user_wishlist.map((item) => item.game_id),
      },
    },
  });

  return (
    <div className="p-10">
      <p className="text-4xl text-white">Wishlist</p>
      <div className="flex flex-wrap gap-5 mt-5">
        {wishlist.map((game) => (
          <Link key={game.game_id} href={`/game/${game.game_id}`}>
            <div className="cursor-pointer hover:scale-105 transition-transform">
              <div
                style={{
                  backgroundImage: `url(${game.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="h-96 w-72 bg-indigo-50 rounded-xl"
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
