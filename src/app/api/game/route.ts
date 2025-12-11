import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, game, user } = await req.json();

    if (action == "add") {
      prisma.wishlist.create({
        data: {
          user_id: user.user.id,
          game_id: game.game_id,
        },
      }).then((data) => {
        console.log(data);
      });
    } else if (action == "remove") {
      prisma.wishlist.deleteMany({
        where: {
          user_id: user.user.id,
          game_id: game.game_id,
        },
      }).then((data) => {
        console.log(data);
      });
    }

    return NextResponse.json({ data: { game_id: game.game_id, user_id: user.user.id } });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
