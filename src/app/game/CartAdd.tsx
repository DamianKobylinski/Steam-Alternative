/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Game } from "@/interfaces/game";
import { Heart, HeartOff } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import WishlistButton from "./WishlistButton";

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
    discount_code: string;
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
  const [discounts, setDiscounts] = useLocalStorage<{ game_id: number; discount: string }[]>("discounts", []);
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
          <p className="mt-auto">
            Already in library!  
          </p>
        </Link>
      ) : (
        <>
          <button
            className="text-xl bg-[#2a7e1c] rounded-xl px-14 py-2 font-extrabold"
            onClick={() => {
              setCartItem((prev) => {
                if (prev.some((item) => item.game_id === game.game_id)) {
                  return prev;
                } else {
                  setPriceView((prev) => {
                    return prev + (Number(gamePrice.toFixed(2)) ?? 0);
                  });
                  return [
                    ...prev,
                    {
                      ...game,
                      price: Number(gamePrice.toFixed(2)),
                    },
                  ];
                }
              });

              if (check_if_in_salary) {
                setDiscounts((prev) => {
                  if (
                    prev.some((item) => item.game_id === game.game_id && item.discount === check_if_in_salary.discount_code)
                  ) {
                    return prev;
                  } else {
                    return [
                      ...prev,
                      {
                        game_id: game.game_id,
                        discount: check_if_in_salary.discount_code,
                      },
                    ];
                  }
                });
              }
            }}
          >
            Buy game!
            <p
              className={`text-3xl ${
                check_if_in_salary ? `text-[#f8d818]` : `text-white-500`
              } `}
            >
              {gamePrice.toFixed(2)} PLN
            </p>
          </button>
          <WishlistButton
            check_if_in_wishlist={check_if_in_wishlist}
            game={{ ...game, price: Number(game.price) }}
          />
        </>
      )}
    </>
  );
};

export default CartAdd;
