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
import { generateMarriageCertificate } from "@/lib/certificates/marriage-certificate"
import { ConfirmDeleteDialog } from "@/components/sector/confirm-delete-dialog"
import { SectorChurchFilter } from "@/components/sector/sector-church-filter"
import {
  DELETE_SECTOR_MERRIAGE,
  GET_ALL_SECTOR_MERRIAGE,
  type SectorMerriage,
  type ServiceResult,
  typedDoc,
} from "@/services/sector-graphql"

interface AllData {
  SectorMerriageRecord: { getAll: SectorMerriage[] | null } | null;
}

interface DeleteData {
  SectorMerriageRecord: { delete: ServiceResult | null } | null;
}

export default function SectorMerriagePage() {
  const isAdmin = useIsAdmin();
  const isSector = useIsSector();
  const [churchFilter, setChurchFilter] = useState('all');
  const [marriageToDelete, setMarriageToDelete] = useState<string | null>(null);

  const [getMarriages, { data, loading, error }] = useLazyQuery(typedDoc<AllData>(GET_ALL_SECTOR_MERRIAGE), {
    fetchPolicy: 'no-cache',
  });
  const [deleteMerriage, { loading: deleting }] = useMutation(typedDoc<DeleteData>(DELETE_SECTOR_MERRIAGE));

  // Un pastor siempre recibe los suyos; el filtro solo lo usa el administrador.
  const reload = useCallback(() => {
    getMarriages({ variables: { sectorChurchId: churchFilter === 'all' ? null : churchFilter } });
  }, [getMarriages, churchFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

  const marriages = data?.SectorMerriageRecord?.getAll ?? [];
  const columns = isAdmin ? 7 : 6;

  const handleDeleteConfirm = async () => {
    if (!marriageToDelete) return;

    try {
      const response = await deleteMerriage({ variables: { id: marriageToDelete } });
      const result = response.data?.SectorMerriageRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Matrimonio eliminado exitosamente');
        reload();
      } else {
        toast.error(result?.message || 'Error al eliminar el matrimonio');
      }
    } catch (err) {
      toast.error('Error al eliminar el matrimonio: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setMarriageToDelete(null);
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <CardTitle>{isAdmin ? 'Matrimonios del Sector' : 'Matrimonios'}</CardTitle>
            <div className="flex items-end gap-3">
              {isAdmin && <SectorChurchFilter value={churchFilter} onChange={setChurchFilter} />}
              {isSector && (
                <Button asChild>
                  <Link href="/sector/merriage/register">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Matrimonio
                  </Link>
                </Button>
              )}
            </div>
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
                    {isAdmin && <TableHead>Iglesia</TableHead>}
                    <TableHead>Esposo</TableHead>
                    <TableHead>Esposa</TableHead>
                    <TableHead>Fecha Civil</TableHead>
                    <TableHead>Fecha Religiosa</TableHead>
                    <TableHead>Lugar</TableHead>
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
                  ) : marriages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        No hay matrimonios disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    marriages.map((marriage) => (
                      <TableRow key={marriage.id}>
                        {isAdmin && <TableCell>{marriage.sectorChurchName || '-'}</TableCell>}
                        <TableCell>{marriage.fullNameHusband || '-'}</TableCell>
                        <TableCell>{marriage.fullNameWife || '-'}</TableCell>
                        <TableCell>{marriage.civilDate || '-'}</TableCell>
                        <TableCell>{marriage.religiousDate || '-'}</TableCell>
                        <TableCell>{marriage.civilPlace || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Acciones">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/sector/merriage/edit?id=${encodeURIComponent(marriage.id)}`} className="flex items-center w-full">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setMarriageToDelete(marriage.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
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

      <ConfirmDeleteDialog
        open={marriageToDelete !== null}
        description="¿Estás seguro de que deseas eliminar este matrimonio? Esta acción no se puede deshacer."
        onCancel={() => setMarriageToDelete(null)}
        onConfirm={handleDeleteConfirm}
        busy={deleting}
      />
    </PageShell>
  )
}
