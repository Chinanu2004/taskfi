// /app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, role } = body;

    if (!walletAddress || !role) {
      return NextResponse.json(
        { error: "Missing walletAddress or role" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        walletAddress,
        id: walletAddress,
      },
    });

    // Also create related profile
    if (role === "freelancer") {
      await prisma.freelancerProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    } else if (role === "hirer") {
      await prisma.hirerProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
