import Popular from "@/components/homepage/Popular";
import Salary from "@/components/homepage/Salary";
import { FC } from "react";

const Home: FC = () => {
  return (
    <>
      <p className="text-3xl my-4 text-white">Popular</p>
      <div className="flex flex-col lg:flex-row gap-10">
        <Popular />
        <Salary />
      </div>
      <p className="text-3xl my-4 text-white font-">New games</p>
      <div className="flex flex-wrap justify-center gap-10 overflow-hidden">
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
      </div>
      <p className="text-3xl my-4 text-white font-">Popular games</p>
      <div className="flex flex-wrap justify-center gap-10 overflow-hidden">
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
          <div className="h-96 w-72 bg-indigo-50 rounded-xl"></div>
      </div>
    </>
  );
};

export default Home;
