import { FC } from "react";

const Salary: FC = () => {
  return (
    <div
      style={{
        backgroundImage:
          "url(https://image.api.playstation.com/vulcan/ap/rnd/202406/0500/8f15268257b878597757fcc5f2c9545840867bc71fc863b1.png)",
        backgroundSize: "cover",
      }}
      className="flex flex-col h-96 w-full p-5 rounded-xl"
    >
      <ul className="my-5 flex justify-center">
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
      <div
        style={{
          boxShadow: "inset 0px 10px 20px rgba(0, 0, 0, 0.5)",
        }}
        className="flex place-items-center justify-center h-12 w-full p-5 bg-[#20CB89] mt-auto"
      >
        <p className="text-white text-4xl font-bold tracking-widest">-20%</p>
      </div>
    </div>
  );
};

export default Salary;
