import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages to track
const TRACKED_PAGES = ["/", "/shop", "/library", "/wishlist", "/contact", "/game"];

function getPageName(pathname: string): string | null {
  // Exact matches
  if (TRACKED_PAGES.includes(pathname)) {
    return pathname;
  }
  // Dynamic routes like /game/[id]
  if (pathname.startsWith("/game/")) {
    return "/game/[id]";
  }
  return null;
}

// Track page view via internal API
async function trackPageView(page: string, method: string, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/track-page`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page, method }),
    });
  } catch {
    // Silently fail - don't block the request
  }
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const method = req.method;
  
  // Track page views for GET requests on tracked pages
  if (method === "GET") {
    const pageName = getPageName(pathname);
    if (pageName) {
      // Fire and forget - don't await
      const baseUrl = req.nextUrl.origin;
      trackPageView(pageName, method, baseUrl);
    }
  }
  
  return NextResponse.next();
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|api/metrics|api/track-page|api/track-login|api/health|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes (except metrics, tracking, and health)
    '/(api(?!/metrics|/track-page|/track-login|/health)|trpc)(.*)',
  ],
};