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
import { GET_ALL_BAPTISM } from "@/services/query"
import { DELETE_BAPTISM } from "@/services/mutation"
import { useRoles } from "@/hooks/use-roles"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil, FileDown, MoreVertical, Trash2 } from "lucide-react"
import { generateBaptismCertificate } from "@/lib/certificates/baptism-certificate"
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

export default function BaptismPage() {
  const [baptisms, setBaptisms] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [baptismToDelete, setBaptismToDelete] = useState<string | null>(null);
  const roles = useRoles();
  const [getBaptisms, { data, loading, error }] = useLazyQuery(GET_ALL_BAPTISM, {
    fetchPolicy: 'no-cache',
  });
  const [deleteBaptism] = useMutation(DELETE_BAPTISM);

  const canCreate = roles.includes('Administrador') || roles.includes('Pastor') || roles.includes('Secretario');

  const handleDeleteClick = (childRUT: string) => {
    setBaptismToDelete(childRUT);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!baptismToDelete) return;

    try {
      const response = await deleteBaptism({
        variables: { childRUT: baptismToDelete }
      });

      const result = (response.data as any)?.BaptismRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Bautizo eliminado exitosamente');
        getBaptisms(); // Recargar la lista
      } else {
        toast.error(result?.message || 'Error al eliminar el bautizo');
      }
    } catch (err: any) {
      toast.error('Error al eliminar el bautizo: ' + (err.message || 'Error desconocido'));
    } finally {
      setDeleteDialogOpen(false);
      setBaptismToDelete(null);
    }
  };

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
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baptisms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                                        <Link href={`/baptism/edit?childRUT=${encodeURIComponent(baptism.childRUT)}`} className="flex items-center w-full">
                                          <Pencil className="h-4 w-4 mr-2" />
                                          Editar
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDeleteClick(baptism.childRUT)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem onClick={() => generateBaptismCertificate(baptism)}>
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
              ¿Estás seguro de que deseas eliminar este bautizo? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setBaptismToDelete(null);
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
