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
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface Member {
  rut: string;
  names: string;
  lastNameDad?: string;
  lastNameMom?: string;
  address?: string;
  mobile?: string;
  dateOfBirth?: string;
  sexo?: string;
}

interface MembersTableProps {
  members: Member[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalCount: number;
  onDelete?: (rut: string) => void;
}

export function MembersTable({
  members,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  onDelete,
}: MembersTableProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RUT</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Fecha de Nacimiento</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No hay miembros disponibles
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.rut}>
                  <TableCell>{member.rut}</TableCell>
                  <TableCell>{member.names}</TableCell>
                  <TableCell>
                    {[member.lastNameDad, member.lastNameMom].filter(Boolean).join(' ')}
                  </TableCell>
                  <TableCell>{member.mobile || '-'}</TableCell>
                  <TableCell>{member.dateOfBirth || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/members/edit/${encodeURIComponent(member.rut)}`}>
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(member.rut)}>
                          <TrashIcon className="h-4 w-4 text-destructive" />
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
          <span className="text-sm text-muted-foreground">Filas por página:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages} ({totalCount} total)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
