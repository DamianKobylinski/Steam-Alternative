import Popular from "@/components/homepage/Popular";
import Salary from "@/components/homepage/Salary";
import Shelf from "@/components/Shelf";
import { FC } from "react";
import uncharted from "@/assets/uncharted.jpeg";

const new_games = [
  {
    id: 1,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  {
    id: 2,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  {
    id: 3,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  {
    id: 4,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  {
    id: 5,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  {
    id: 6,
    name: "Uncharted 4",
    description:
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Computer Entertainment. It is the fourth main entry in the Uncharted series.",
    image: uncharted,
    price: 59.99,
    discount: 10
  },
  
];

const Home: FC = () => {
  return (
    <>
      <p className="text-3xl my-4 text-white">Popular</p>
      <div className="flex flex-col lg:flex-row gap-10">
        <Popular />
        <Salary />
      </div>
      <Shelf name="New Games" data={new_games} />
      <Shelf name="Popular Games" data={new_games} />
    </>
  );
};

export default Home;
