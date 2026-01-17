import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  httpRequestsTotal,
  httpRequestDuration,
  searchQueryDuration,
  databaseQueryDuration,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const route = "/api/search";
  
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const queryType = query ? "text" : "all";
    
    // Start search timing
    const searchStart = Date.now();
    
    let games;
    if (query) {
      // Text search
      games = await prisma.games.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 50,
      });
    } else {
      // Get all games
      games = await prisma.games.findMany({
        take: 50,
      });
    }
    
    const searchDuration = (Date.now() - searchStart) / 1000;
    
    // Record search query duration
    searchQueryDuration.observe({ query_type: queryType }, searchDuration);
    
    // Record database query duration
    databaseQueryDuration.observe(
      { operation: "findMany", table: "games" },
      searchDuration
    );
    
    httpRequestsTotal.inc({ method: "GET", route, status_code: "200" });
    httpRequestDuration.observe(
      { method: "GET", route, status_code: "200" },
      (Date.now() - startTime) / 1000
    );
    
    return NextResponse.json({
      success: true,
      query,
      count: games.length,
      games,
    });
    
  } catch (error) {
    console.error("Search error:", error);
    
    httpRequestsTotal.inc({ method: "GET", route, status_code: "500" });
    httpRequestDuration.observe(
      { method: "GET", route, status_code: "500" },
      (Date.now() - startTime) / 1000
    );
    
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
