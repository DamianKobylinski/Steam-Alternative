import { StaticImageData } from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface ShelfProps {
  name: string;
  data?: {
    id: number;
    name: string;
    description: string;
    image: StaticImageData;
    price: number;
    discount?: number;
  }[];
}

const Shelf: FC<ShelfProps> = ({ name, data }) => {
  return (
    <>
      <p className="text-3xl my-4 text-white font-">{name}</p>
      <ScrollArea>
        <div className="flex w-full justify-start gap-10 overflow-hidden">
          {data?.map((item) => (
            <div key={item.id} className="cursor-pointer">
              <Link href={`/game/${item.id}`}>
                <div
                  style={{
                    backgroundImage: `url(${item.image.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="h-96 w-72 bg-indigo-50 rounded-xl"
                ></div>
                <div className="flex justify-between text-white text-2xl my-4">
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default Shelf;
