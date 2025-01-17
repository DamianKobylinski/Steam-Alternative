import { Game } from "@/interfaces/game";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const {userId, cartItem} = await req.json();
        const prisma = new PrismaClient();

        console.log(userId, cartItem);

        await prisma.library.createMany({
            data: cartItem.map((item: Game) => ({
                user_id: userId,
                game_id: item.game_id,
            }))
        });

        return NextResponse.json({ message: "Success" });

    } catch (error) {
        return NextResponse.json({ message: error });
    }
}