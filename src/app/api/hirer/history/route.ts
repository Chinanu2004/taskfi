// /app/api/hirer/history/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { walletAddress } = await req.json()

  if (!walletAddress) return NextResponse.json({ error: 'No wallet address' }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      hirer: {
        include: {
          jobs: {
            include: {
              freelancer: { include: { user: true } },
              category: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  })

  if (!user || !user.hirer) {
    return NextResponse.json({ error: 'Hirer not found' }, { status: 404 })
  }

  return NextResponse.json(user.hirer.jobs)
}
