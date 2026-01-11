"use client";
import { FC, useState } from "react";
import { Game } from "@/interfaces/game";
import Link from "next/link";
import { useEffect } from "react";

interface SalaryProps {
  sale: {
    id: number;
    game_id: number;
    percent_of_bargain: number;
  }[];
  data: Game[];
}

const Salary: FC<SalaryProps> = ({ sale, data }) => {
  const [salaryGame, setSalaryGame] = useState(data[0]);


  useEffect(() => {
    const interval = setInterval(() => {
      setSalaryGame((prevGame) => {
        const currentIndex = data.findIndex((game) => game.game_id === prevGame.game_id);
        const nextIndex = (currentIndex + 1) % data.length;
        return data[nextIndex];
      });
    }, 17000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      style={{
        backgroundImage: `url(${salaryGame?.bg_image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col h-64 sm:h-80 lg:h-96 pt-3 sm:pt-5 w-full sm:w-[350px] lg:w-[600px] rounded-xl"
    >
      <ul className="flex justify-center">
        {sale.map((game) => (
          <li
            key={game.id}
            style={{
              boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
            className={`min-w-4 min-h-4 ${
              game.game_id === salaryGame.game_id ? "bg-[#3A506B]" : "bg-white"
            }  mr-2 rounded-full cursor-pointer transition-colors duration-700`}
            onClick={() => {
              const foundGame = data.find(
                (item) => item.game_id === game.game_id
              );
              if (foundGame) {
                setSalaryGame(foundGame);
              }
            }}
          ></li>
        ))}
      </ul>
      <Link href={`/game/${salaryGame.game_id}`}
      className="flex place-items-center justify-center w-full mt-auto">
        <div
          style={{
            boxShadow: "inset 0px 10px 20px rgba(0, 0, 0, 0.5)",
          }}
          className="flex place-items-center justify-center h-10 sm:h-12 lg:h-14 px-4 w-full bg-[#2a7e1c]"
        >
          <p className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-widest">
            -
            {sale
              .find((item) => item.game_id === salaryGame.game_id)
              ?.percent_of_bargain.toString()}
            %
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Salary;
