/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Game } from "@/interfaces/game";
import { useUser } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

const Success = () => {
  const user_information = useUser();
  const [priceView, setPriceView] = useLocalStorage<number>("priceView", 0);
  const [cartItem, setCartItem] = useLocalStorage<Game[]>("cartItem", []);
  const [discounts, setDiscounts] = useLocalStorage<
    { game_id: number; discount: string }[]
  >("discounts", []);


  if (user_information && user_information.user === null) {
    redirect("/");
  }

  const handleStoring = async () => {
    if (user_information.user && user_information.user.id !== undefined) {
      const response = async () => {
        await fetch("/api/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user_information.user.id,
            cartItem: cartItem,
          }),
        });
      };

      const data = response();
      console.log(data);
      setPriceView(0);
      setCartItem([]);
      setDiscounts([]);
      redirect("/");
    }
  };

  return (
    <div className="flex flex-col h-screen place-content-center items-center">
      <div className="flex flex-col place-items-center gap-5">
        <Check className="text-green-500" size={64} />
        <h1>Payment Completed</h1>
        <p>Thank you for your purchase!</p>
        <Button variant={"default"} onClick={handleStoring}>
          Wróć do strony głównej
        </Button>
      </div>
    </div>
  );
};

export default Success;
