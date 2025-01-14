import { FC } from "react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const GamePage: FC = async () => {
  const { userId } = await auth().catch(() => ({ userId: null }));

  const prisma = new PrismaClient();
  const games_in_library = userId
    ? await prisma.library.findMany({
        where: {
          user_id: userId,
        },
      })
    : [];
  const allGames = await prisma.games.findMany({
    where: {
      NOT: {
        game_id: {
          in: games_in_library.map((item) => item.game_id),
        },
      },
    },
  });

  return (
    <div className="p-10">
      <p className="text-4xl text-white">Shop</p>
      <p className="text-orange-500">In progress</p>
      <div className="flex flex-wrap gap-10 my-4">
        {allGames.map((item) => (
          <div
            key={item.game_id}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <Link href={`/game/${item.game_id}`}>
              <div
                style={{
                  backgroundImage: `url(${item.image_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="h-96 w-72 bg-indigo-50 rounded-xl"
              >
                <div className="flex h-full place-items-end mt-auto justify-between dark:text-white text-black text-2xl p-4 ">
                  <p className="font-bold w-1/2">{item.title}</p>
                  <p className="bg-white w-1/2 text-end text-black p-2 rounded-xl font-bold">
                    {item.price.toString()} $
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
