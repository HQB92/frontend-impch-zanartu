'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/loader"
import { GET_ALL_OFFERINGS } from "@/services/query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OfferingPage() {
  const [offerings, setOfferings] = useState<any[]>([]);
  const [getOfferings, { data, loading, error }] = useLazyQuery(GET_ALL_OFFERINGS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getOfferings({
      variables: { user: null, churchId: null, mes: null, anio: null }
    });
  }, [getOfferings]);

  useEffect(() => {
    if (data) {
      setOfferings((data as any)?.Offering?.getAll || []);
    }
  }, [data]);

  if (loading) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Loader />
      </SidebarInset>
    </SidebarProvider>
  );

  const totalAmount = offerings.reduce((sum, offering) => sum + (parseFloat(offering.amount) || 0), 0);

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
        <div className="flex flex-1 flex-col p-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ofrendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total: ${totalAmount.toLocaleString('es-CL')}</p>
              </div>
              {error ? (
                <p className="text-destructive">Error al cargar ofrendas: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offerings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No hay ofrendas disponibles
                          </TableCell>
                        </TableRow>
                      ) : (
                        offerings.map((offering) => (
                          <TableRow key={offering.id}>
                            <TableCell>{offering.date || '-'}</TableCell>
                            <TableCell>${(parseFloat(offering.amount) || 0).toLocaleString('es-CL')}</TableCell>
                            <TableCell>{offering.type || '-'}</TableCell>
                            <TableCell>{offering.state || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
