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
import { GET_ALL_INVENTORY, GET_ALL_CHURCH } from "@/services/query"
import { DELETE_INVENTORY } from "@/services/mutation"
import { applyPagination } from "@/utils/apply-pagination"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InventoryPage() {
  const [response, setResponse] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [churchId, setChurchId] = useState<string>('all');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [churches, setChurches] = useState<any[]>([]);

  const [getInventories, { data, loading, error, refetch }] = useLazyQuery(GET_ALL_INVENTORY, {
    fetchPolicy: 'no-cache',
  });

  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, {
    fetchPolicy: 'no-cache',
  });

  const [deleteInventory] = useMutation(DELETE_INVENTORY, {
    onCompleted: (data: any) => {
      const response = data?.Inventory?.delete;
      if (response?.code === 200) {
        toast.success(response.message || 'Inventario eliminado exitosamente');
        refetch();
      } else {
        toast.error(response?.message || 'Error al eliminar el inventario');
      }
    },
    onError: (error) => {
      toast.error('Error al eliminar el inventario: ' + error.message);
    },
  });

  useEffect(() => {
    getChurches();
    getInventories();
  }, [getChurches, getInventories]);

  useEffect(() => {
    if (data) {
      let inventories = (data as any)?.Inventory?.getAll || [];
      
      // Filtrar por iglesia si está seleccionada (excluir 'all')
      if (churchId && churchId !== 'all') {
        inventories = inventories.filter((inv: any) => inv.churchId === Number(churchId));
      }
      
      // Filtrar por año
      inventories = inventories.filter((inv: any) => inv.year === year);
      
      setResponse(inventories);
    }
  }, [data, churchId, year]);

  useEffect(() => {
    if (churchesData) {
      setChurches((churchesData as any)?.Church?.getAll || []);
    }
  }, [churchesData]);

  const inventories = useMemo(() => {
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
    if (confirm('¿Estás seguro de que deseas eliminar este inventario?')) {
      await deleteInventory({
        variables: { id }
      });
    }
  }, [deleteInventory]);

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
              <p className="text-destructive">Error al cargar inventarios: {error.message}</p>
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
                <CardTitle>Inventario de Bienes Muebles e Inmuebles</CardTitle>
                <Button asChild>
                  <Link href="/inventory/create">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Inventario
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="churchId">Iglesia</Label>
                  <Select value={churchId} onValueChange={setChurchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las iglesias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las iglesias</SelectItem>
                      {churches.map((church) => (
                        <SelectItem key={church.id} value={church.id.toString()}>
                          {church.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un año" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.max(1, new Date().getFullYear() - 2025) }, (_, i) => {
                        const yearOption = 2026 + i;
                        return (
                          <SelectItem key={yearOption} value={yearOption.toString()}>
                            {yearOption}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <InventoryTable
                inventories={inventories}
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
