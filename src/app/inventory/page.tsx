'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InventoryTable } from "@/components/inventory-table"
import { Loader } from "@/components/loader"
import { GET_ALL_BANK } from "@/services/query"
import { DELETE_BANK } from "@/services/mutation"
import { applyPagination } from "@/utils/apply-pagination"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InventoryPage() {
  const [response, setResponse] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [churchId, setChurchId] = useState<number>(0);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());

  const [getBanks, { data, loading, error, refetch }] = useLazyQuery(GET_ALL_BANK, {
    fetchPolicy: 'no-cache',
  });

  const [deleteBank] = useMutation(DELETE_BANK, {
    onCompleted: (data: any) => {
      const response = data?.Bank?.delete;
      if (response?.code === 200) {
        toast.success(response.message || 'Movimiento eliminado exitosamente');
        refetch();
      } else {
        toast.error(response?.message || 'Error al eliminar el movimiento');
      }
    },
    onError: (error) => {
      toast.error('Error al eliminar el movimiento: ' + error.message);
    },
  });

  useEffect(() => {
    getBanks({
      variables: {
        churchId: churchId !== 0 ? churchId : undefined,
        mes: mes,
        anio: anio,
      }
    });
  }, [churchId, mes, anio, getBanks]);

  useEffect(() => {
    if (data) {
      setResponse((data as any)?.Bank?.getAll || []);
    }
  }, [data]);

  const banks = useMemo(() => {
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
    if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      await deleteBank({
        variables: { id }
      });
    }
  }, [deleteBank]);

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
              <p className="text-destructive">Error al cargar inventario: {error.message}</p>
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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inventario / Movimientos Bancarios</CardTitle>
                <Button asChild>
                  <Link href="/inventory/create">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Movimiento
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="mes">Mes</Label>
                  <Input
                    id="mes"
                    type="number"
                    min="1"
                    max="12"
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anio">Año</Label>
                  <Input
                    id="anio"
                    type="number"
                    min="2020"
                    max="2100"
                    value={anio}
                    onChange={(e) => setAnio(Number(e.target.value))}
                  />
                </div>
              </div>
              <InventoryTable
                banks={banks}
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
