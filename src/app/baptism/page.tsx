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
import { GET_ALL_BAPTISM } from "@/services/query"
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

export default function BaptismPage() {
  const [baptisms, setBaptisms] = useState<any[]>([]);
  const roles = useRoles();
  const [getBaptisms, { data, loading, error }] = useLazyQuery(GET_ALL_BAPTISM, {
    fetchPolicy: 'no-cache',
  });

  const canCreate = roles.includes('Administrador') || roles.includes('Pastor') || roles.includes('Secretario');

  useEffect(() => {
    getBaptisms();
  }, [getBaptisms]);

  useEffect(() => {
    if (data) {
      setBaptisms((data as any)?.BaptismRecord?.getAll || []);
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
                <CardTitle>Bautizos</CardTitle>
                {canCreate && (
                  <Button asChild>
                    <Link href="/baptism/register">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Bautizo
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-destructive">Error al cargar bautizos: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Niño/a</TableHead>
                        <TableHead>RUT</TableHead>
                        <TableHead>Padre</TableHead>
                        <TableHead>Madre</TableHead>
                        <TableHead>Fecha Bautismo</TableHead>
                        {canCreate && <TableHead>Acciones</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baptisms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={canCreate ? 6 : 5} className="text-center text-muted-foreground">
                            No hay bautizos disponibles
                          </TableCell>
                        </TableRow>
                      ) : (
                        baptisms.map((baptism, index) => (
                          <TableRow key={index}>
                            <TableCell>{baptism.childFullName || '-'}</TableCell>
                            <TableCell>{baptism.childRUT || '-'}</TableCell>
                            <TableCell>{baptism.fatherFullName || '-'}</TableCell>
                            <TableCell>{baptism.motherFullName || '-'}</TableCell>
                            <TableCell>{baptism.baptismDate || '-'}</TableCell>
                            {canCreate && (
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/baptism/edit?childRUT=${encodeURIComponent(baptism.childRUT)}`}>
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
