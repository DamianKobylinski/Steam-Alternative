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
    <div className="p-4 md:p-10 w-full">
      <p className="text-2xl md:text-4xl text-white">Wishlist</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mt-5 place-items-center">
        {wishlist.map((game) => (
          <Link key={game.game_id} href={`/game/${game.game_id}`}>
            <div className="cursor-pointer hover:scale-105 transition-transform z-10 hover:z-20">
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
