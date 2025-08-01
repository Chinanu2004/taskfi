// /api/user/verify/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

export async function POST(req: Request) {
  const { message, signature, wallet } = await req.json()

  if (!message || !signature || !wallet) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const isValid = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      bs58.decode(signature),
      bs58.decode(wallet)
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    await prisma.user.update({
      where: { walletAddress: wallet },
      data: { isWalletVerified: true },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 500 })
  }
}
