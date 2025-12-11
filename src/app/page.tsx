import Popular from "@/components/homepage/Popular";
import Salary from "@/components/homepage/Salary";
import Shelf from "@/components/Shelf";
import prisma from "@/lib/prisma"; 

const Home = async () => {
  const popular = (
    await prisma.games.findMany({
      where: {
        take_a_look: true,
      },
    })
  ).map((game) => ({
    ...game,
    price: Number(game.price),
  }));
  const salary = (await prisma.salary.findMany()).map((item) => ({
    ...item,
    percent_of_bargain: Number(item.percent_of_bargain),
  }));
  const games_for_sale = (
    await prisma.games.findMany({
      where: {
        game_id: {
          in: salary.map((item) => item.game_id),
        },
      },
    })
  ).map((game) => ({
    ...game,
    price: Number(game.price),
  }));

  return (
    <div className="p-10">
      <p className="text-6xl my-4 text-white">Home</p>
      <p className="text-3xl my-4 text-white">Take a Look</p>
      <div className="flex flex-col place-items-center lg:flex-row gap-5">
        <Popular data={popular} />
        <Salary sale={salary} data={games_for_sale} />
      </div>
      <div className="flex flex-col w-full mt-2">
        <Shelf name="New Games" />
        <Shelf name="Popular Games" />
      </div>
    </div>
  );
};

export default Home;
