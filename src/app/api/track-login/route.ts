import { NextRequest, NextResponse } from "next/server";
import { userLoginsByCountry } from "@/lib/metrics";

// Check if IP is private/localhost
function isPrivateIP(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  );
}

interface GeoData {
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

async function getGeoLocation(ip: string): Promise<GeoData> {
  // Default to Poland for local development
  if (isPrivateIP(ip)) {
    return {
      country: "Poland",
      countryCode: "PL",
      lat: 52.2297,
      lon: 21.0122,
    };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,lat,lon`);
    if (response.ok) {
      const data = await response.json();
      if (data.country) {
        return {
          country: data.country,
          countryCode: data.countryCode || "XX",
          lat: data.lat || 0,
          lon: data.lon || 0,
        };
      }
    }
  } catch {
    // Fallback on error
  }

  return {
    country: "Unknown",
    countryCode: "XX",
    lat: 0,
    lon: 0,
  };
}

// Track user login with geolocation
export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "127.0.0.1";

    const geo = await getGeoLocation(ip);

    userLoginsByCountry.inc({
      country: geo.country,
      country_code: geo.countryCode,
      latitude: String(geo.lat),
      longitude: String(geo.lon),
    });

    return NextResponse.json({ success: true, country: geo.country });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
