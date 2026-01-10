import { NextResponse } from "next/server";
import { httpRequestsTotal, httpRequestDuration } from "@/lib/metrics";

export async function GET() {
  const startTime = Date.now();
  const route = "/api/health";
  
  httpRequestsTotal.inc({ method: "GET", route, status_code: "200" });
  httpRequestDuration.observe(
    { method: "GET", route, status_code: "200" },
    (Date.now() - startTime) / 1000
  );
  
  return NextResponse.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "nextjs-app"
  });
}
