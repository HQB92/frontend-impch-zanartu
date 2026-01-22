'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Reset redirect flag when auth state changes
    if (isLoading) {
      hasRedirected.current = false;
      return;
    }

    // Only redirect if not authenticated, not already redirected, and not already on login page
    if (!isAuthenticated && !hasRedirected.current && pathname !== '/login' && pathname !== '/') {
      if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('token');
        if (!token) {
          hasRedirected.current = true;
          router.push('/login');
        }
      } else {
        hasRedirected.current = true;
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return { isAuthenticated, isLoading };
}
