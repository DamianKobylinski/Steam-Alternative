import Link from "next/link";
import { FC } from "react";
import prisma from "@/lib/prisma";

interface ShelfProps {
  name: string;
}

const Shelf: FC<ShelfProps> = async ({ name }) => {
  const allGames = await prisma.games.findMany({
    orderBy:
      name == "New Games" ? { release_date: "desc" } : { popularity: "desc" },
  });
  const salaryGames = await prisma.salary.findMany();

  return (
    <>
      <p className="text-xl sm:text-2xl lg:text-3xl my-4 text-white">{name}</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full justify-items-center gap-4 md:gap-6 lg:gap-10 overflow-hidden p-2 sm:p-4 lg:p-10">
        {allGames.slice(0, 5).map((item) => (
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
                  {salaryGames.find((game) => game.game_id === item.game_id) ? (
                    <p className="bg-[#2a7e1c] w-1/2 text-end text-[#f8d818] p-2 rounded-xl font-bold">
                      {(
                        ((Number(item.price) ?? 0) *
                          (100 -
                            (Number(
                              salaryGames.find(
                                (game) => game.game_id === item.game_id
                              )?.percent_of_bargain
                            ) ?? 0))) /
                        100
                      ).toFixed(2)}{" "}
                      PLN
                    </p>
                  ) : (
                    <p className="bg-white w-1/2 text-end text-black p-2 rounded-xl font-bold">
                      {item.price.toString()} PLN
                    </p>
                  )}
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
