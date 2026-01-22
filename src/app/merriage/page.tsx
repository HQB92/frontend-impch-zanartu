'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/loader"
import { GET_ALL_MERRIAGE } from "@/services/query"
import { useRoles } from "@/hooks/use-roles"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function MerriagePage() {
  const [marriages, setMarriages] = useState<any[]>([]);
  const roles = useRoles();
  const [getMarriages, { data, loading, error }] = useLazyQuery(GET_ALL_MERRIAGE, {
    fetchPolicy: 'no-cache',
  });

  const canCreate = roles.includes('Administrador') || roles.includes('Pastor') || roles.includes('Secretario');

  useEffect(() => {
    getMarriages();
  }, [getMarriages]);

  useEffect(() => {
    if (data) {
      setMarriages((data as any)?.MerriageRecord?.getAll || []);
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
                <CardTitle>Matrimonios</CardTitle>
                {canCreate && (
                  <Button asChild>
                    <Link href="/merriage/register">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Matrimonio
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-destructive">Error al cargar matrimonios: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Esposo</TableHead>
                        <TableHead>Esposa</TableHead>
                        <TableHead>Fecha Civil</TableHead>
                        <TableHead>Fecha Religiosa</TableHead>
                        <TableHead>Lugar</TableHead>
                        {canCreate && <TableHead>Acciones</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marriages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={canCreate ? 6 : 5} className="text-center text-muted-foreground">
                            No hay matrimonios disponibles
                          </TableCell>
                        </TableRow>
                      ) : (
                        marriages.map((marriage) => (
                          <TableRow key={marriage.id}>
                            <TableCell>{marriage.fullNameHusband || '-'}</TableCell>
                            <TableCell>{marriage.fullNameWife || '-'}</TableCell>
                            <TableCell>{marriage.civilDate || '-'}</TableCell>
                            <TableCell>{marriage.religiousDate || '-'}</TableCell>
                            <TableCell>{marriage.civilPlace || '-'}</TableCell>
                            {canCreate && (
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/merriage/edit?id=${encodeURIComponent(marriage.id)}`}>
                                    <Pencil className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TableCell>
                            )}
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
