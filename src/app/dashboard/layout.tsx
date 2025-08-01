'use client'

import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/select-role') // Your onboarding route
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="p-8 text-white">🔄 Checking profile…</div>
  }

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  )
}
