'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil, FileDown, MoreVertical, Trash2 } from "lucide-react"
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
import { useIsAdmin, useIsSector } from "@/hooks/use-roles"
import { generateBaptismCertificate } from "@/lib/certificates/baptism-certificate"
import { ConfirmDeleteDialog } from "@/components/sector/confirm-delete-dialog"
import { SectorChurchFilter } from "@/components/sector/sector-church-filter"
import {
  DELETE_SECTOR_BAPTISM,
  GET_ALL_SECTOR_BAPTISM,
  type SectorBaptism,
  type ServiceResult,
  typedDoc,
} from "@/services/sector-graphql"

interface AllData {
  SectorBaptismRecord: { getAll: SectorBaptism[] | null } | null;
}

interface DeleteData {
  SectorBaptismRecord: { delete: ServiceResult | null } | null;
}

export default function SectorBaptismPage() {
  const isAdmin = useIsAdmin();
  const isSector = useIsSector();
  const [churchFilter, setChurchFilter] = useState('all');
  const [baptismToDelete, setBaptismToDelete] = useState<string | null>(null);

  const [getBaptisms, { data, loading, error }] = useLazyQuery(typedDoc<AllData>(GET_ALL_SECTOR_BAPTISM), {
    fetchPolicy: 'no-cache',
  });
  const [deleteBaptism] = useMutation(typedDoc<DeleteData>(DELETE_SECTOR_BAPTISM));

  // Un pastor siempre recibe los suyos; el filtro solo lo usa el administrador.
  const reload = useCallback(() => {
    getBaptisms({ variables: { sectorChurchId: churchFilter === 'all' ? null : churchFilter } });
  }, [getBaptisms, churchFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

  const baptisms = data?.SectorBaptismRecord?.getAll ?? [];
  const columns = isAdmin ? 7 : 6;

  const handleDeleteConfirm = async () => {
    if (!baptismToDelete) return;

    try {
      const response = await deleteBaptism({ variables: { id: baptismToDelete } });
      const result = response.data?.SectorBaptismRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Bautizo eliminado exitosamente');
        reload();
      } else {
        toast.error(result?.message || 'Error al eliminar el bautizo');
      }
    } catch (err) {
      toast.error('Error al eliminar el bautizo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setBaptismToDelete(null);
    }
  };

  const downloadCertificate = (baptism: SectorBaptism) => {
    // El certificado escribe el texto tal cual: un padre sin datos debe quedar
    // en blanco, no como "null".
    generateBaptismCertificate({ ...baptism, fatherFullName: baptism.fatherFullName ?? '' });
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <CardTitle>{isAdmin ? 'Bautizos del Sector' : 'Bautizos'}</CardTitle>
            <div className="flex items-end gap-3">
              {isAdmin && <SectorChurchFilter value={churchFilter} onChange={setChurchFilter} />}
              {isSector && (
                <Button asChild>
                  <Link href="/sector/baptism/register">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Bautizo
                  </Link>
                </Button>
              )}
            </div>
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
                    {isAdmin && <TableHead>Iglesia</TableHead>}
                    <TableHead>Niño/a</TableHead>
                    <TableHead>RUT</TableHead>
                    <TableHead>Padre</TableHead>
                    <TableHead>Madre</TableHead>
                    <TableHead>Fecha Bautismo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : baptisms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        No hay bautizos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    baptisms.map((baptism) => (
                      <TableRow key={baptism.id}>
                        {isAdmin && <TableCell>{baptism.sectorChurchName || '-'}</TableCell>}
                        <TableCell>{baptism.childFullName || '-'}</TableCell>
                        <TableCell>{baptism.childRUT || '-'}</TableCell>
                        <TableCell>{baptism.fatherFullName || '-'}</TableCell>
                        <TableCell>{baptism.motherFullName || '-'}</TableCell>
                        <TableCell>{baptism.baptismDate || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Acciones">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/sector/baptism/edit?id=${encodeURIComponent(baptism.id)}`} className="flex items-center w-full">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setBaptismToDelete(baptism.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => downloadCertificate(baptism)}>
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

      <ConfirmDeleteDialog
        open={baptismToDelete !== null}
        description="¿Estás seguro de que deseas eliminar este bautizo? Esta acción no se puede deshacer."
        onCancel={() => setBaptismToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  )
}
