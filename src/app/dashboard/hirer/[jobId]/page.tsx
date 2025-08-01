// /app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { jobId, rating, comment, hirerId, freelancerId } = await req.json();

    // Ensure only one review per job
    const existing = await prisma.review.findUnique({ where: { jobId } });
    if (existing) {
      return NextResponse.json({ error: 'Review already exists for this job.' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        jobId,
        rating,
        comment,
        hirerId,
        freelancerId,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review POST Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
