import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { MoveLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Game({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const hostname = headersList.get('x-forwarded-host');
  console.log("Referere:" + referer);
  console.log("Host name:"+ "http://" + hostname + "/");
  const prisma = new PrismaClient();
  const id = (await params).id;

  const game = await prisma.games.findUnique({
    where: {
      game_id: Number(id),
    },
  });

  return (
    <div className="p-10">
      <Link
        href={referer === "http://" + hostname + "/" ? "/" : "/shop"}
        className="flex gap-5 text-orange-500 text-2xl py-5 hover:translate-x-2 transition-transform"
      >
        <MoveLeft size={32} />
        {referer == "http://" + hostname + "/" ? <>Powrót na stronę główną</> : <>Powrót do sklepu</>}
        
      </Link>
      <div
        style={{
          backgroundImage: `url(${game?.bg_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-[600px] w-full bg-indigo-50 rounded-xl"
      ></div>
      <div className="absolute top-[375px] lg:ml-12 ">
        <div className="flex flex-col">
          <div
            style={{
              backgroundImage: `url(${game?.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="h-96 w-72 bg-indigo-50 rounded-xl"
          ></div>
          <div className="flex flex-col place-items-start lg:flex-row lg:place-items-center gap-10">
            <p className="text-4xl my-4 text-white">{game?.title}</p>
            <SignedIn>
              <button
                className="bg-blue-500 rounded-xl px-5"
              >
                Buy game
              </button>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <button className="bg-red-500 rounded-xl px-5">
                  Sign in to buy game
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className="mt-6">
          <p className="w-3/4 lg:w-1/2">{game?.description}</p>
        </div>
      </div>
    </div>
  );
}
