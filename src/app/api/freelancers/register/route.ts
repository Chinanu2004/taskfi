// app/api/freelancers/register/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, walletAddress, categoryIds } = body; // ✅ FIXED: destructure walletAddress

    const user = await prisma.user.create({
      data: {
        email,
        name,
        walletAddress,
        role: 'freelancer',
        freelancer: {
          create: {
            categories: {
              connect: categoryIds.map((id: number) => ({ id }))
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to register freelancer' },
      { status: 500 }
    );
  }
}
