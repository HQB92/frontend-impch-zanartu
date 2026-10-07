'use client';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GET_SECTOR_CHURCHES, typedDoc } from "@/services/sector-graphql"

interface ChurchesData {
  SectorChurch: { getAll: { id: string; name: string }[] | null } | null;
}

interface SectorChurchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

// Filtro por iglesia para el administrador. 'all' significa todas.
export function SectorChurchFilter({ value, onChange }: SectorChurchFilterProps) {
  const [getChurches, { data }] = useLazyQuery(typedDoc<ChurchesData>(GET_SECTOR_CHURCHES), {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getChurches();
  }, [getChurches]);

  const churches = data?.SectorChurch?.getAll ?? [];

  return (
    <div className="space-y-1">
      <Label className="text-xs">Iglesia</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {churches.map((church) => (
            <SelectItem key={church.id} value={String(church.id)}>
              {church.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
