'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname !== '/login' && pathname !== '/') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return { isAuthenticated, isLoading };
}
