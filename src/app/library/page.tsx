import { FC } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

const Library: FC = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }
  const library = await prisma.library.findMany({
    where: {
      user_id: userId,
    },
  });

  const games = await prisma.games.findMany({
    where: {
      game_id: {
        in: library.map((item) => item.game_id),
      },
    },
  });

  return (
    <div className="p-4 md:p-10 w-full">
      <p className="text-2xl md:text-4xl text-white">Library</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mt-5 place-items-center">
        {games.map((item) => (
          <Link key={item.game_id} href={`/game/${item.game_id}`}>
            <div className="cursor-pointer hover:scale-105 transition-transform">
              <div
                style={{
                  backgroundImage: `url(${item.image_url})`,
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

export default Library;
