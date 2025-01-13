"use client";

import { Heart } from "lucide-react";
import { FC, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import PopularList from "./components/PopularList";
import { Game } from "@/interfaces/game";

interface PopularProps {
  data: Game[];
}

const Popular: FC<PopularProps> = ({ data }) => {
  const [popularGame, setPopularGame] = useState(data[0]);

  const handlePopularGame = (game : Game) => {
    setPopularGame(game);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${popularGame?.bg_image})`,
        backgroundSize: "cover",
      }}
      className="flex flex-col w-full h-96 p-5 rounded-xl"
    >
      <PopularList popular={data} handlePopular={handlePopularGame} />
      <div className="flex flex-col lg:flex-row mt-auto">
        <div>
          <p className="text-4xl font-bold my-4">{popularGame?.title}</p>
          <p className="hidden lg:block text-base my-4 w-1/2">
            {popularGame?.description}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-end mt-auto w-full gap-5">
          <SignedIn>
            <div className="cursor-pointer px-5 bg-[#CB2020] flex flex-col items-center justify-center rounded-xl font-bold">
              <p>Buy now</p>
              <p className="text-2xl">{popularGame?.price.toString()} $</p>
            </div>
            <div className="flex justify-center items-center bg-[#C4C4C4] p-3 bg-opacity-50 rounded-xl cursor-pointer">
              <Heart className="z-20" height="25px" width="25px" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <div className="cursor-pointer h-[50px] p-7 bg-blue-500 flex flex-col items-center justify-center rounded-xl font-bold">
                <p>Sign in to buy</p>
                <p className="text-2xl">{popularGame?.price.toString()} $</p>
              </div>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Popular;
