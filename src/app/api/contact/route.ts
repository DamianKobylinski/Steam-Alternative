import prisma, { withDbTracking } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  httpRequestsTotal,
  httpRequestDuration,
  contactSubmissionsTotal,
} from "@/lib/metrics";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const route = "/api/contact";
  
  try {
    const { email, subject, message } = await req.json();

    // Basic validation
    if (typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      httpRequestsTotal.inc({ method: "POST", route, status_code: "400" });
      httpRequestDuration.observe(
        { method: "POST", route, status_code: "400" },
        (Date.now() - startTime) / 1000
      );
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    console.log(email, subject, message);

    const data = await withDbTracking("create", "contact", () =>
      prisma.contact.create({
        data: {
          email: email,
          subject: subject,
          message: message,
        },
      })
    );

    console.log(data);

    contactSubmissionsTotal.inc();
    httpRequestsTotal.inc({ method: "POST", route, status_code: "200" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "200" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ data: { email, subject, message } });
  } catch (error) {
    httpRequestsTotal.inc({ method: "POST", route, status_code: "500" });
    httpRequestDuration.observe(
      { method: "POST", route, status_code: "500" },
      (Date.now() - startTime) / 1000
    );
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
