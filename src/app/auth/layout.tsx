'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem('userRole');

    if (role === 'hirer' && pathname !== '/dashboard/hirer') {
      router.push('/dashboard/hirer');
    } else if (role === 'freelancer' && pathname !== '/dashboard/freelancer') {
      router.push('/dashboard/freelancer');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
