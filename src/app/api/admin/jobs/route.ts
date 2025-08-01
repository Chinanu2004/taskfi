// app/api/admin/jobs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        hirer: {
          include: {
            user: true, // So you can see hirer email, name, etc.
          },
        },
        category: true,
        applications: {
          include: {
            freelancer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
