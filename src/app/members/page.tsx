'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { DELETE_MEMBER } from "@/services/mutation"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MembersTable } from "@/components/members-table"
import { Loader } from "@/components/loader"
import { GET_ALL_MEMBERS } from "@/services/query"
import { applyPagination } from "@/utils/apply-pagination"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/solid"

export default function MembersPage() {
  const [response, setResponse] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeMember, setTypeMember] = useState(0);
  const [churchId, setChurchId] = useState(0);

  const [getMember, { data, loading, error }] = useLazyQuery(GET_ALL_MEMBERS, {
    fetchPolicy: 'no-cache',
  });
  const [deleteMember] = useMutation(DELETE_MEMBER);

  useEffect(() => {
    getMember({
      variables: { churchId, typeMember }
    });
  }, [typeMember, churchId, getMember]);

  const handleDelete = useCallback(async (rut: string) => {
    if (!confirm('¿Eliminar este miembro?')) return;
    try {
      const res: any = await deleteMember({ variables: { rut } });
      const r = res?.data?.Member?.delete;
      if (r?.code === 200) {
        toast.success(r.message || 'Miembro eliminado');
        getMember({ variables: { churchId, typeMember } });
      } else {
        toast.error(r?.message || 'Error al eliminar');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  }, [deleteMember, getMember, churchId, typeMember]);

  useEffect(() => {
    if (data) {
      setResponse((data as any)?.Member?.getAll || []);
    }
  }, [data]);

  const members = useMemo(() => {
    return applyPagination(response, page, rowsPerPage);
  }, [page, rowsPerPage, response]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

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
              <p className="text-destructive">Error al cargar miembros: {error.message}</p>
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
                <CardTitle>Miembros</CardTitle>
                <Button asChild>
                  <Link href="/members/register">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Miembro
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MembersTable
                members={members}
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
