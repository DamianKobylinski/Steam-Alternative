"use client";

import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Game } from "@/interfaces/game";
import { useEffect, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CardList = () => {
  const [priceView, setPriceView] = useLocalStorage<number>("priceView", 0);
  const [triggerPayment, setTriggerPayment] = useState<boolean>(false);
  const [cartItem, setCartItem] = useLocalStorage<Game[]>("cartItem", []);
  const [discounts, setDiscounts] = useLocalStorage<
    { game_id: number; discount: string }[]
  >("discounts", []);

  useEffect(() => {
    if (priceView <= 0) setPriceView(0);
  }, [priceView]);

  useEffect(() => {
    setTriggerPayment(false);
  }, [triggerPayment]);

  const handlePayment = async () => {
    if (cartItem.length === 0) return;

    const arrayProductId = cartItem.map((item) => item.prod_id);

    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe failed to load");
      return;
    }

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ arrayProductId, discounts }),
    });

    const session = await response.json();

    console.log("Checkout Session:", session);

    if (session.url) {
      window.location.href = session.url;
    } else {
      console.error("No Checkout URL found");
    }
  };

  return (
    <>
      <SheetTrigger asChild className="flex items-center gap-4">
        <ShoppingCart />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>
            {cartItem.length > 0 ? (
              <>
                Your cart total is{" "}
                <span className="text-white">{priceView.toFixed(2)} $</span>
              </>
            ) : (
              <>Your cart is empty. Add some games to your cart!</>
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-5 space-y-3">
          {cartItem.map((item) => (
            <div
              key={item.game_id}
              className="grid grid-cols-2 md:grid-cols-4 justify-center place-items-center gap-2 md:gap-4 p-2 rounded-lg bg-muted/50"
            >
              <img
                src={item.image_url}
                width={50}
                height={20}
                alt={item.title}
                className="rounded"
              />
              <h3 className="text-sm md:text-base truncate max-w-[100px] md:max-w-none">{item.title}</h3>
              <p className="text-sm md:text-base">{item.price}</p>
              <Button
                variant={"default"}
                onClick={() => {
                  setCartItem((prev: Game[]) => {
                    return prev.filter((game) => game.game_id !== item.game_id);
                  });
                  setPriceView((prev) => {
                    return prev - (Number(item.price) ?? 0);
                  });
                  setDiscounts((prev) => {
                    return prev.filter(
                      (discount) => discount.game_id !== item.game_id
                    );
                  });
                }}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
        <SheetFooter className="flex place-items-center gap-5">
          {cartItem.length > 0 && (
            <Button variant={"default"} onClick={handlePayment}>
              Pay!
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </>
  );
};

export default CardList;
