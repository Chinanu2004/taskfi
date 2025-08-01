// lib/notifications.ts
import { prisma } from '@/lib/prisma'

export const createNotification = async ({
  userId,
  type,
  message,
}: {
  userId: number
  type: 'job_hired' | 'job_accepted' | 'message_received' | 'admin_action'
  message: string
}) => {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      message,
    },
  })
}
