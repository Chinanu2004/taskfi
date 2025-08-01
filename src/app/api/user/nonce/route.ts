// /api/user/nonce/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')

  if (!wallet) {
    return NextResponse.json({ error: 'Missing wallet' }, { status: 400 })
  }

  const nonce = generateNonce()

  await prisma.user.upsert({
    where: { walletAddress: wallet },
    update: {},
    create: { walletAddress: wallet },
  })

  return NextResponse.json({ nonce })
}
