import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { wallet: string } }) {
  try {
    const freelancer = await prisma.user.findUnique({
      where: { walletAddress: params.wallet },
      include: {
        freelancer: {
          include: {
            applications: {
              where: {
                status: 'accepted',
                completionStatus: 'approved',
              },
              include: {
                job: {
                  include: { category: true }
                }
              }
            },
            categories: true,
            freelancerCategories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    if (!freelancer) {
      return NextResponse.json({ success: false, message: 'Freelancer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: freelancer });
  } catch (error) {
    console.error('Error fetching freelancer profile:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
