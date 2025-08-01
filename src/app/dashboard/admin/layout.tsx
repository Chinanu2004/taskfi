// app/dashboard/admin/layout.tsx
import React from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mb-6 space-x-4 border-b pb-4">
        <Link href="/dashboard/admin/jobs" className="hover:text-blue-500">Jobs</Link>
        <Link href="/dashboard/admin/disputes" className="hover:text-blue-500">Disputes</Link>
        <Link href="/dashboard/admin/users" className="hover:text-blue-500">Users</Link>
      </div>
      {children}
    </div>
  )
}
