import { Game } from "@/interfaces/game";
import { auth } from "@clerk/nextjs/server";
import prisma, { withDbTracking } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  httpRequestsTotal,
  httpRequestDuration,
  gamePurchasesTotal,
  databaseQueryDuration,
  activeUsersGauge,
} from "@/lib/metrics";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const route = "/api/store";
  
  try {
    const { userId } = await auth();
    if (!userId) {
      httpRequestsTotal.inc({ method: "POST", route, status_code: "401" });
      httpRequestDuration.observe(
        { method: "POST", route, status_code: "401" },
        (Date.now() - startTime) / 1000
      );
      return NextResponse.json({ message: "User not authenticated" });
    } else {
      activeUsersGauge.inc();
      const { cartItem } = await req.json();

      const dbStart1 = Date.now();
      await withDbTracking("createMany", "library", () =>
        prisma.library.createMany({
          data: cartItem.map((item: Game) => ({
            user_id: userId,
            game_id: item.game_id,
          })),
        })
      );
      databaseQueryDuration.observe(
        { operation: "createMany", table: "library" },
        (Date.now() - dbStart1) / 1000
      );

      // Track each game purchase
      cartItem.forEach((item: Game) => {
        gamePurchasesTotal.inc({ game_id: String(item.game_id) });
      });
        
      const dbStart2 = Date.now();
      await withDbTracking("deleteMany", "wishlist", () =>
        prisma.wishlist.deleteMany({
          where: {
            user_id: userId,
            game_id: {
              in: cartItem.map((item: Game) => item.game_id),
            },
          },
        })
      );
      databaseQueryDuration.observe(
        { operation: "deleteMany", table: "wishlist" },
        (Date.now() - dbStart2) / 1000
      );

      httpRequestsTotal.inc({ method: "POST", route, status_code: "200" });
      httpRequestDuration.observe(
        { method: "POST", route, status_code: "200" },
        (Date.now() - startTime) / 1000
      );
      return NextResponse.json({ message: "Success" });
    }
  } catch (error) {
    httpRequestsTotal.inc({ method: "POST", route, status_code: "500" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "500" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ message: error });
  }
}
