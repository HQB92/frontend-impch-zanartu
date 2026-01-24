'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface Inventory {
  id: string;
  churchId: number;
  year: number;
  date: string;
  observations?: string | null;
  church?: {
    id: number;
    name: string;
    address?: string | null;
  } | null;
  buildingDetails?: {
    id: number;
    propertyArea?: number | null;
    builtArea?: number | null;
  } | null;
  items?: Array<{
    id: number;
    itemName: string;
    category: string;
    quantity?: number | null;
  }> | null;
}

interface InventoryTableProps {
  inventories: Inventory[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
  onDelete?: (id: string) => void;
}

export function InventoryTable({
  inventories,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  onDelete,
}: InventoryTableProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL');
  };

  const getItemsCount = (items: Inventory['items']) => {
    if (!items || items.length === 0) return 0;
    return items.length;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Año</TableHead>
              <TableHead>Iglesia</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Área Propiedad (m²)</TableHead>
              <TableHead>Área Edificada (m²)</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay inventarios registrados
                </TableCell>
              </TableRow>
            ) : (
              inventories.map((inventory) => (
                <TableRow key={inventory.id}>
                  <TableCell className="font-medium">{inventory.year}</TableCell>
                  <TableCell>{inventory.church?.name || '-'}</TableCell>
                  <TableCell>{formatDate(inventory.date)}</TableCell>
                  <TableCell>
                    {inventory.buildingDetails?.propertyArea 
                      ? `${inventory.buildingDetails.propertyArea} m²` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {inventory.buildingDetails?.builtArea 
                      ? `${inventory.buildingDetails.builtArea} m²` 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getItemsCount(inventory.items)} items
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/inventory/edit/${inventory.id}`}>
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/inventory/edit/${inventory.id}`}>
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(inventory.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {page * rowsPerPage + 1} a {Math.min((page + 1) * rowsPerPage, totalCount)} de {totalCount} inventarios
          </p>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Anterior
          </Button>
          <p className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages || 1}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Siguiente
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
