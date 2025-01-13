'use client';
import { FC } from "react";
import wishlist from "@/data/wishlist.json";
import { useUser } from "@clerk/nextjs";

const GamePage: FC = () => {
  const user = useUser();
  return (
    <div className="p-10">
      <p className="text-4xl text-white">Wishlist</p>
      <p className="text-orange-500">In progress</p>
      <div className="flex flex-wrap gap-5">
        {wishlist
          .filter((item) => item.user === user.user?.username)
          .map((item) => {
            return item.games.map((game, index) => (
              <div
                key={index}
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  style={{
                    backgroundImage: `url(${game.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="h-96 w-72 bg-indigo-50 rounded-xl"
                ></div>
              </div>
            ));
          })}
      </div>
    </div>
  );
};

export default GamePage;
