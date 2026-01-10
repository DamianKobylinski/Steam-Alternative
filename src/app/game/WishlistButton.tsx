"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/interfaces/game";
import { useUser } from "@clerk/nextjs";
import { Heart, HeartOff, Loader2 } from "lucide-react";
import { useState } from "react";

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
  const [isInWishlist, setIsInWishlist] = useState(!!check_if_in_wishlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlistChange = async (action: "add" | "remove") => {
    // Optimistic update - change UI immediately
    const previousState = isInWishlist;
    setIsInWishlist(action === "add");
    setIsLoading(true);

    try {
      const response = await fetch("/api/game/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, game, user }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        // Revert on error
        setIsInWishlist(previousState);
        console.error("Failed to update wishlist:", data);
      }
    } catch (error) {
      // Revert on error
      setIsInWishlist(previousState);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        className={`flex h-full justify-center items-center ${
          isInWishlist ? "bg-[#00ddff]" : "bg-[#1b8eed]"
        } p-[25px] bg-opacity-50 rounded-xl cursor-pointer transition-all duration-300 text-white hover:bg-[#ccf8ff] hover:text-black disabled:opacity-70`}
        onClick={() => {
          if (isInWishlist) {
            handleWishlistChange("remove");
          } else {
            handleWishlistChange("add");
          }
        }}
      >
        {isLoading ? (
          <Loader2 className="z-20 animate-spin" height="25px" width="25px" />
        ) : isInWishlist ? (
          <Heart className="z-20 fill-current" height="30px" width="30px" />
        ) : (
          <HeartOff className="z-20" height="25px" width="25px" />
        )}
      </Button>
    </>
  );
};

export default WishlistButton;
