import { NextRequest, NextResponse } from "next/server";
import { pageViewsTotal } from "@/lib/metrics";

// Internal endpoint for tracking page views from middleware
export async function POST(req: NextRequest) {
  try {
    const { page, method } = await req.json();
    
    if (page && method) {
      pageViewsTotal.inc({ page, method });
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
