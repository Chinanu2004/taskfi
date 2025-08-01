// src/app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET() {
  const [totalUsers, activeJobs, completedJobs, recentJobs] = await Promise.all([
    prisma.user.count(),
    prisma.job.count({ where: { status: 'active' } }),
    prisma.job.findMany({ where: { status: 'completed' }, select: { price: true } }),
    prisma.job.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: { createdAt: true },
    }),
  ]);

  // ✅ Fixed: No `.toNumber()` needed
  const totalFundsReleased = completedJobs.reduce((acc, job) => acc + Number(job.price ?? 0), 0);

  const jobsPerDay = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return { date: format(date, 'yyyy-MM-dd'), count: 0 };
  });

  recentJobs.forEach((job) => {
    const day = format(job.createdAt, 'yyyy-MM-dd');
    const match = jobsPerDay.find((d) => d.date === day);
    if (match) match.count++;
  });

  return NextResponse.json({
    success: true,
    data: {
      totalUsers,
      activeJobs,
      totalFundsReleased,
      jobsPerDay,
    },
  });
}
