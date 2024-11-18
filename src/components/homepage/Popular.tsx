import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { FC } from "react";

const Popular: FC = () => {
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
          <p className="text-4xl font-bold my-4">Hogwarts Legacy</p>
          <p className="hidden lg:block text-base my-4">
            Hogwarts Legacy is an immersive, open-world action RPG. Now you can
            take control of the action and be at the center of your own
            adventure in the wizarding world.
          </p>

          <div className="hidden lg:flex ">
            <Badge className="mr-2" variant={"secondary"}>
              Magic
            </Badge>
            <Badge className="mx-2" variant={"secondary"}>
              Open World
            </Badge>
            <Badge className="mx-2" variant={"secondary"}>
              Fantasy
            </Badge>
            <Badge className="mx-2" variant={"secondary"}>
              Adventure
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 justify-start md:justify-end mt-auto">
          <div className="cursor-pointer bg-[#CB2020] flex flex-col w-full md:w-[200px] items-center justify-center rounded-xl font-bold">
            <p>Buy now</p>
            <p className="text-2xl">150.00 zł</p>
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
