"use client";

import { Game } from "@/interfaces/game";
import { Heart, HeartOff } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

interface CartAddProps {
  check_if_in_library: {
    id: number;
    game_id: string;
    user_id: number;
  } | null;
  check_if_in_salary: {
    id: number;
    game_id: string;
    percent_of_bargain: number;
  } | null;
  check_if_in_wishlist: {
    id: number;
    game_id: number;
    user_id: string;
  } | null;
  game: Game;
}

const CartAdd: FC<CartAddProps> = ({
  check_if_in_library,
  check_if_in_salary,
  check_if_in_wishlist,
  game,
}) => {
  const [priceView, setPriceView] = useLocalStorage<number>("priceView", 0);
  const [cartItem, setCartItem] = useLocalStorage<Game[]>("cartItem", []);
  const [gamePrice, setGamePrice] = useState<number>(0);

  useEffect(() => {
    if (check_if_in_salary) {
      setGamePrice(() => {
        return (
          ((Number(game?.price) ?? 0) *
            (100 - (Number(check_if_in_salary?.percent_of_bargain) ?? 0))) /
          100
        );
      });
    } else {
      setGamePrice(() => {
        return Number(game?.price) ?? 0;
      });
    }
  }, []);

  return (
    <>
      {check_if_in_library ? (
        <Link
          href={"/library"}
          className="text-xl bg-orange-500 rounded-xl px-14 py-2 font-extrabold"
        >
          <p className="mt-auto">Przejdź do biblioteki</p>
        </Link>
      ) : (
        <>
          <button
            className="text-xl bg-red-500 rounded-xl px-14 py-2 font-extrabold"
            onClick={() => {
              if (check_if_in_salary) {
                setCartItem((prev: Game[]) => {
                  return [
                    ...prev,
                    { ...game, price: Number(gamePrice.toFixed(2)) },
                  ];
                });
              } else {
                setCartItem((prev: Game[]) => {
                  return [...prev, game];
                });
              }
              setPriceView((prev) => {
                return prev + (Number(gamePrice.toFixed(2)) ?? 0);
              });
            }}
          >
            Buy game
            <p
              className={`text-3xl ${
                check_if_in_salary ? `text-green-400` : `text-white-500`
              } `}
            >
              {gamePrice.toFixed(2)} $
            </p>
          </button>
          {check_if_in_wishlist ? (
            <div className="flex justify-center items-center bg-red-700 p-[25px] bg-opacity-50 rounded-xl cursor-pointer transition-transform animate-in duration-300">
              <Heart className="z-20 " height="25px" width="25px" />
            </div>
          ) : (
            <div className="flex justify-center items-center bg-[#C4C4C4] p-[25px] bg-opacity-50 rounded-xl cursor-pointer transition-transform animate-out duration-300">
              <HeartOff className="z-20 " height="25px" width="25px" />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CartAdd;
