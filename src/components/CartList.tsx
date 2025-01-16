"use client";

import {
  SheetClose,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const CardList = () => {
  const [priceView, setPriceView] = useLocalStorage<number>("priceView", 0);
  const [triggerPayment, setTriggerPayment] = useState<boolean>(false);
  const [cartItem, setCartItem] = useLocalStorage<Game[]>("cartItem", []);

  useEffect(() => {
    if (priceView <= 0) setPriceView(0);
  }, [priceView]);

  useEffect(() => {
    setTriggerPayment(false);
  }, [triggerPayment]);

  return (
    <>
      <SheetTrigger asChild className="flex items-center gap-4">
          <ShoppingCart />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Koszyk</SheetTitle>
          <SheetDescription>
            {cartItem.length > 0 ? (
              <p className="text-xl">
                Twój koszyk: <span className="text-white">{priceView.toFixed(2)} $</span>
              </p>
            ) : (
              <p>Twój koszyk jest pusty</p>
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-5">
          {cartItem.map((item) => (
            <div
              key={item.game_id}
              className="grid grid-cols-4 justify-center place-items-center gap-4"
            >
              <img
                src={item.image_url}
                width={50}
                height={20}
                alt={item.title}
              />
              <h3>{item.title}</h3>
              <p>{item.price}</p>
              <Button
                variant={"default"}
                onClick={() => {
                  setCartItem((prev: Game[]) => {
                    return prev.filter((game) => game.game_id !== item.game_id);
                  });
                  setPriceView((prev) => {
                    return prev - (Number(item.price) ?? 0);
                  });
                }}
              >
                Usuń
              </Button>
            </div>
          ))}
        </div>
        <SheetFooter className="flex place-items-center gap-5">
          {cartItem.length > 0 && (
            <>
              <Dialog>
                <DialogTrigger asChild>Zapłać</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Twój koszyk</DialogTitle>
                    <DialogDescription>
                      Dokonaj zakupu za {priceView} $
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </>
  );
};

export default CardList;
