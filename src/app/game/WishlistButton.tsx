"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/interfaces/game";
import { useUser } from "@clerk/nextjs";
import { Heart, HeartOff } from "lucide-react";

const WishlistButton = ({
  check_if_in_wishlist,
  game,
}: {
  check_if_in_wishlist: {
    id: number;
    game_id: number;
    user_id: string;
  } | null;
  game: Game | null;
}) => {
  const user = useUser();
  const handleWishlistChange = async (action: "add" | "remove") => {
    try {
      const response = await fetch("/api/game/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, game, user }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    window.location.reload();
  };

  return (
    <>
      <Button
        className={`flex h-full justify-center items-center ${
          check_if_in_wishlist ? "bg-[#00ddff]" : "bg-[#1b8eed]"
        } p-[25px] bg-opacity-50 rounded-xl cursor-pointer transition-transform animate-in duration-300 text-white hover:bg-[#ccf8ff] hover:text-black`}
        onClick={() => {
          if (check_if_in_wishlist) {
            handleWishlistChange("remove");
          } else {
            handleWishlistChange("add");
          }
        }}
      >
        {check_if_in_wishlist ? (
          <Heart className="z-20 " height="50px" width="50px" />
        ) : (
          <HeartOff className="z-20 " height="25px" width="25px" />
        )}
      </Button>
    </>
  );
};

export default WishlistButton;
