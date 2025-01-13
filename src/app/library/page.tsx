import { FC } from "react";
import { PrismaClient } from "@prisma/client";

const GamePage: FC = async () => {
  const prisma = new PrismaClient();
  const library = await prisma.library.findMany({
    where: {
      user_id: '1',
    }
  });
  
  const games = await prisma.games.findMany({
    where: {
      game_id: {
        in: library.map((item) => item.game_id),
      },
    },
  });



  return (
    <div className="p-10">
      <p className="text-4xl text-white">Library</p>
      <p className="text-orange-500">In progress</p>
      <div className="flex flex-wrap gap-5">

        {games.
          map((item) => (
          <div
            key={item.game_id}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <div
              style={{
                backgroundImage: `url(${item.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="h-96 w-72 bg-indigo-50 rounded-xl"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
