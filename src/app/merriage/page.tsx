'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from "sonner";
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
import { DELETE_MERRIAGE } from "@/services/mutation"
import { useRoles } from "@/hooks/use-roles"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil, FileDown, MoreVertical, Trash2 } from "lucide-react"
import { generateMarriageCertificate } from "@/lib/certificates/marriage-certificate"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MerriagePage() {
  const [marriages, setMarriages] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marriageToDelete, setMarriageToDelete] = useState<string | null>(null);
  const roles = useRoles();
  const [getMarriages, { data, loading, error }] = useLazyQuery(GET_ALL_MERRIAGE, {
    fetchPolicy: 'no-cache',
  });
  const [deleteMerriage] = useMutation(DELETE_MERRIAGE);

  const canCreate = roles.includes('Administrador') || roles.includes('Pastor') || roles.includes('Secretario');

  const handleDeleteClick = (id: string) => {
    setMarriageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!marriageToDelete) return;

    try {
      const response = await deleteMerriage({
        variables: { id: marriageToDelete }
      });

      const result = (response.data as any)?.MerriageRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Matrimonio eliminado exitosamente');
        getMarriages(); // Recargar la lista
      } else {
        toast.error(result?.message || 'Error al eliminar el matrimonio');
      }
    } catch (err: any) {
      toast.error('Error al eliminar el matrimonio: ' + (err.message || 'Error desconocido'));
    } finally {
      setDeleteDialogOpen(false);
      setMarriageToDelete(null);
    }
  };

  useEffect(() => {
    getMarriages();
  }, [getMarriages]);

  // Recargar cuando la página vuelve a tener foco (útil cuando se vuelve desde registro/edición)
  useEffect(() => {
    const handleFocus = () => {
      getMarriages();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
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
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marriages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {canCreate && (
                                    <>
                                      <DropdownMenuItem asChild>
                                        <Link href={`/merriage/edit?id=${encodeURIComponent(marriage.id)}`} className="flex items-center w-full">
                                          <Pencil className="h-4 w-4 mr-2" />
                                          Editar
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteClick(marriage.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem onClick={() => generateMarriageCertificate(marriage)}>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Certificado
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
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
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este matrimonio? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setMarriageToDelete(null);
              }}
            >
              No
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
