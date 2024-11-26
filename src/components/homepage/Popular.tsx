"use client";

import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { FC, useState } from "react";

const popular = [
  {
    title: "Hogwarts Legacy",
    description:
      "Hogwarts Legacy is an immersive, open-world action RPG. Now you can take control of the action and be at the center of your own adventure in the wizarding world.",
    badges: ["Magic", "Open World", "Fantasy", "Adventure"],
    price: 150,
  },
  {
    title: "Elden Ring",
    description:
      "Elden Ring is an upcoming action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment.",
    badges: ["Action", "RPG", "Fantasy", "Adventure"],
    price: 200,
  },
  {
    title: "The Witcher 3: Wild Hunt",
    description:
      "The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by CD Projekt.",
    badges: ["Action", "RPG", "Fantasy", "Adventure"],
    price: 100,
  },
  {
    title: "Cyberpunk 2077",
    description:
      "Cyberpunk 2077 is a 2020 action role-playing video game developed and published by CD Projekt.",
    badges: ["Action", "RPG", "Sci-Fi", "Adventure"],
    price: 250,
  },
  {
    title: "The Elder Scrolls V: Skyrim",
    description:
      "The Elder Scrolls V: Skyrim is an action role-playing game developed by Bethesda Game Studios and published by Bethesda Softworks.",
    badges: ["Action", "RPG", "Fantasy", "Adventure"],
    price: 120,
  }
];

const Popular: FC = () => {
  const [current, setCurrent] = useState(3);
  return (
    <div
      style={{
        backgroundImage:
          "url(https://wallpapers.com/images/hd/hogwarts-legacy-magical-castle-panorama-4tcun0dm98b9olu0.jpg)",
        backgroundSize: "cover",
      }}
      className="flex flex-col h-96 px-5 py-5 lg:min-w-[700px] rounded-xl text-white"
    >
      <ul className="flex justify-center">
        <li
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="min-w-4 min-h-4 bg-[#3A506B] mr-2 rounded-full cursor-pointer"
        ></li>
        <li
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="min-w-4 min-h-4 bg-white mx-2 rounded-full cursor-pointer"
        ></li>
        <li
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="min-w-4 min-h-4 bg-white mx-2 rounded-full cursor-pointer"
        ></li>
        <li
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="min-w-4 min-h-4 bg-white mx-2 rounded-full cursor-pointer"
        ></li>
        <li
          style={{
            boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
          className="min-w-4 min-h-4 bg-white mx-2 rounded-full cursor-pointer"
        ></li>
      </ul>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-auto">
        <div>
          <p className="text-4xl font-bold my-4">{popular[current].title}</p>
          <p className="hidden lg:block text-base my-4">
            {popular[current].description}
          </p>
          <div className="hidden lg:flex ">
            {popular[current].badges.map((badge) => (
              <Badge key={badge} className="mx-2" variant={"secondary"}>
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-start md:justify-end mt-auto">
          <div className="cursor-pointer bg-[#CB2020] flex flex-col w-full md:w-[200px] items-center justify-center rounded-xl font-bold">
            <p>Buy now</p>
            <p className="text-2xl">{popular[current].price} zł</p>
          </div>
          <div className="flex justify-center items-center bg-[#C4C4C4] p-3 bg-opacity-50 rounded-xl cursor-pointer">
            <Heart className="z-20" height="25px" width="25px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popular;
