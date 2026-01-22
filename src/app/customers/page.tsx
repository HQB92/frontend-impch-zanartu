'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/users-table"
import { Loader } from "@/components/loader"
import { GET_ALL_USER } from "@/services/query"
import { applyPagination } from "@/utils/apply-pagination"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useRoles } from "@/hooks/use-roles"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const [response, setResponse] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const roles = useRoles();

  const [getUsers, { data, loading, error }] = useLazyQuery(GET_ALL_USER, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });

  // Handle authentication redirect in useEffect (not during render)
  useEffect(() => {
    if (error && (error.message.includes('not authenticated') || error.message.includes('Authorization'))) {
      router.push('/login');
    }
  }, [error, router]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      getUsers();
    }
  }, [isAuthenticated, authLoading, getUsers]);

  useEffect(() => {
    if (data) {
      setResponse((data as any)?.User?.getAll || []);
    }
  }, [data]);

  const users = useMemo(() => {
    return applyPagination(response, page, rowsPerPage);
  }, [page, rowsPerPage, response]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const canCreate = roles.includes('Administrador') || roles.includes('Pastor');

  if (authLoading || loading) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Loader />
      </SidebarInset>
    </SidebarProvider>
  );

  if (error) {
    // Don't redirect during render - redirect is handled in useEffect above
    const isAuthError = error.message.includes('not authenticated') || error.message.includes('Authorization');
    
    if (isAuthError) {
      return null; // Redirect will happen in useEffect
    }
    
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-6">
            <Card>
              <CardContent>
                <p className="text-destructive">Error al cargar usuarios: {error.message}</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Usuarios</CardTitle>
                {canCreate && (
                  <Button asChild>
                    <Link href="/customers/register">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Usuario
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <UsersTable
                users={users}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalCount={response.length}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
