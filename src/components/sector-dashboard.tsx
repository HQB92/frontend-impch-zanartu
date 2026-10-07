'use client';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import Link from 'next/link';
import { Baby, Heart } from "lucide-react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { GET_SECTOR_COUNTS, typedDoc } from "@/services/sector-graphql"

interface CountsData {
  SectorBaptismRecord: { count: number | null } | null;
  SectorMerriageRecord: { count: number | null } | null;
}

interface CountCardProps {
  label: string;
  value: number | null;
  icon: React.ComponentType<{ className?: string }>;
  listHref: string;
  createHref: string;
  createLabel: string;
}

function CountCard({ label, value, icon: Icon, listHref, createHref, createLabel }: CountCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase">{label}</p>
            <p className="text-3xl font-bold">{value ?? '-'}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={createHref}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {createLabel}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={listHref}>Ver todos</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectorDashboard() {
  const { user } = useAuth();
  const [getCounts, { data, error }] = useLazyQuery(typedDoc<CountsData>(GET_SECTOR_COUNTS), {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getCounts();
  }, [getCounts]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        {error && (
          <p className="text-destructive">Error al cargar el resumen: {error.message}</p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CountCard
            label="Bautizos"
            value={data?.SectorBaptismRecord?.count ?? null}
            icon={Baby}
            listHref="/sector/baptism"
            createHref="/sector/baptism/register"
            createLabel="Nuevo Bautizo"
          />
          <CountCard
            label="Matrimonios"
            value={data?.SectorMerriageRecord?.count ?? null}
            icon={Heart}
            listHref="/sector/merriage"
            createHref="/sector/merriage/register"
            createLabel="Nuevo Matrimonio"
          />
        </div>
      </div>
    </PageShell>
  );
}
