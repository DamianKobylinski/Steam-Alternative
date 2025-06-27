import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { email, subject, message } = await req.json();

    // Basic validation
    if (typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    console.log(email, subject, message);

    const data = await prisma.contact.create({
      data: {
        email: email,
        subject: subject,
        message: message,
      },
    });

    console.log(data);

    return NextResponse.json({ data: { email, subject, message } });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
