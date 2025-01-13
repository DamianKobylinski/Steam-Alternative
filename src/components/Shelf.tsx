import Link from "next/link";
import { FC } from "react";
import { PrismaClient } from "@prisma/client";

interface ShelfProps {
  name: string;
}

const Shelf: FC<ShelfProps> = async ({ name }) => {
  const prisma = new PrismaClient();
  const allGames = await prisma.games.findMany({
    orderBy: name == "New Games" ? { release_date: 'desc' } : { popularity: 'desc' },
  });

  return (
    <>
      <p className="text-3xl my-4 text-white font-">{name}</p>
      <div className="py-10 px-10 flex flex-wrap w-full justify-center lg:justify-start gap-10 overflow-hidden ">
        {allGames.slice(0, 5)
          .map((item) => (
            <div
              key={item.game_id}
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              <Link href={`/game/${item.game_id}`}>
                <div
                  style={{
                    backgroundImage: `url(${item?.image_url})`,
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
    </>
  );
};

export default Shelf;
