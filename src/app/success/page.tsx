/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/interfaces/game";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

const Success = () => {
  const [priceView, setPriceView] = useLocalStorage<number>("priceView", 0);
  const [cartItem, setCartItem] = useLocalStorage<Game[]>("cartItem", []);
  const [discounts, setDiscounts] = useLocalStorage<
    { game_id: number; discount: string }[]
  >("discounts", []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItem: cartItem,
        }),
      });

      const data = await response.json();
      if (data.message === "Success") { 
        setPriceView(0);
        setCartItem([]);
        setDiscounts([]);
      }else{
        redirect("/");
      }
    };

    fetchData();
  }, []);

  const handleStoring = async () => {
    redirect("/");
  };

  return (
    <div className="flex flex-col h-screen place-content-center items-center">
      <div className="flex flex-col place-items-center gap-5">
        <Check className="text-green-500" size={64} />
        <h1>
          Payment successful!
        </h1>
        <p>
          Thank you for your purchase! Your game is now available in your library.  
        </p>
        <Button variant={"default"} onClick={handleStoring}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Success;
