import { Game } from "@/interfaces/game";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "User not authenticated" });
    } else {
      const { cartItem } = await req.json();
      const prisma = new PrismaClient();

      await prisma.library.createMany({
        data: cartItem.map((item: Game) => ({
          user_id: userId,
          game_id: item.game_id,
        })),
      });

      await prisma.wishlist.deleteMany({
        where: {
          user_id: userId,
          game_id: {
            in: cartItem.map((item: Game) => item.game_id),
          },
        },
      });

      return NextResponse.json({ message: "Success" });
    }
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
