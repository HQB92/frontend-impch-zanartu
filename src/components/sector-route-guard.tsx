'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { canAccessPath } from '@/lib/sector-access';
import { Loader } from '@/components/loader';

// Devuelve al dashboard a quien entra a una ruta que no corresponde a su rol.
// Es comodidad de interfaz: la protección real está en el backend.
export function SectorRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const allowed = isLoading || !isAuthenticated || canAccessPath(user?.roles, pathname);

  useEffect(() => {
    if (!allowed) router.replace('/dashboard');
  }, [allowed, router]);

  if (!allowed) return <Loader />;

  return <>{children}</>;
}
