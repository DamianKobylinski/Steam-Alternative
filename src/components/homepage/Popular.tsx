"use client";

import { FC, useEffect, useState } from "react";
import PopularList from "./components/PopularList";
import { Game } from "@/interfaces/game";
import Link from "next/link";

interface PopularProps {
  data: Game[];
}

const Popular: FC<PopularProps> = ({ data }) => {
  const [popularGame, setPopularGame] = useState(data[0]);

  const handlePopularGame = (game: Game) => {
    setPopularGame(game);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPopularGame((prevGame) => {
        const currentIndex = data.findIndex(
          (game) => game.game_id === prevGame.game_id
        );
        const nextIndex = (currentIndex + 1) % data.length;
        return data[nextIndex];
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      style={{
        backgroundImage: `url(${popularGame?.bg_image})`,
        backgroundSize: "cover",
      }}
      className="flex flex-col w-full h-96 p-5 rounded-xl"
    >
      <PopularList
        active={popularGame}
        popular={data}
        handlePopular={handlePopularGame}
      />
      <div className="flex flex-col lg:flex-row mt-auto">
        <div>
          <p className="text-4xl font-bold my-4">{popularGame?.title}</p>
          <p className="hidden lg:block text-base my-4 w-1/2">
            {popularGame?.description && popularGame.description.length > 100 ? popularGame.description.slice(0, 100) + "..." : popularGame?.description}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-end mt-auto w-full gap-5">
          <Link
            href={`/game/${popularGame?.game_id}`}
            className="text-xl bg-[#2292ee] rounded-xl px-14 py-2 font-extrabold"
          >
            <p className="mt-auto text-center">Sprawdź!</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Popular;
