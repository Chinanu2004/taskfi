// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher-server';

// GET: Fetch messages by chatId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ success: false, message: 'chatId is required' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: Number(chatId) },
      orderBy: { sentAt: 'asc' },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('[GET_MESSAGES_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

// POST: Send a new message and emit via Pusher
export async function POST(req: Request) {
  const body = await req.json();
  const { chatId, senderId, receiverId, content } = body;

  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        receiverId,
        content,
      },
    });

    // 🔥 Emit message to Pusher channel
    await pusherServer.trigger(`chat-${chatId}`, 'new-message', message);

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error('[SEND_MESSAGE_ERROR]', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
