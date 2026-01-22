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
import { ChurchesTable } from "@/components/churches-table"
import { Loader } from "@/components/loader"
import { GET_ALL_CHURCH } from "@/services/query"
import { applyPagination } from "@/utils/apply-pagination"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"

export default function ChurchsPage() {
  const [response, setResponse] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [getChurches, { data, loading, error, refetch }] = useLazyQuery(GET_ALL_CHURCH, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getChurches();
  }, [getChurches]);

  useEffect(() => {
    if (data) {
      setResponse((data as any)?.Church?.getAll || []);
    }
  }, [data]);

  const churches = useMemo(() => {
    return applyPagination(response, page, rowsPerPage);
  }, [page, rowsPerPage, response]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta iglesia?')) {
      // TODO: Implementar mutación de eliminación
      console.log('Eliminar iglesia:', id);
      // Después de eliminar, refetch
      refetch();
    }
  }, [refetch]);

  if (loading) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Loader />
      </SidebarInset>
    </SidebarProvider>
  );

  if (error) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          <Card>
            <CardContent>
              <p className="text-destructive">Error al cargar iglesias: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );

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
                <CardTitle>Iglesias</CardTitle>
                <Button asChild>
                  <Link href="/churchs/create">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nueva Iglesia
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChurchesTable
                churches={churches}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                totalCount={response.length}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
