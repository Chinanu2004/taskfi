import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { applicationId, action } = await req.json();

    if (!applicationId || !['paid', 'refunded'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Missing or invalid data' }, { status: 400 });
    }

    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        completionStatus: action === 'paid' ? 'paid' : 'refunded',
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Escrow update failed:', error);
    return NextResponse.json({ success: false, message: 'Error updating escrow status' }, { status: 500 });
  }
}
