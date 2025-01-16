import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { email, subject, message } = await req.json();

    console.log(email, subject, message);

    await prisma.contact.create({
        data: {
          email: email,
          subject: subject,
          message: message,
        },
      })
      .then((data) => {
        console.log(data);
      });

    return NextResponse.json({ data: { email, subject, message } });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
}
