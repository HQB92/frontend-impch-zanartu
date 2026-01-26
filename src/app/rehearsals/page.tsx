'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/loader"
import { GET_ALL_REHEARSALS, GET_REHEARSAL_ATTENDANCE_STATS } from "@/services/query"
import { DELETE_REHEARSAL } from "@/services/mutation"
import Link from "next/link"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const getAttendanceColor = (percentage: number): string => {
  if (percentage < 40) {
    return 'bg-red-600';
  } else if (percentage < 70) {
    return 'bg-yellow-500';
  } else {
    return 'bg-green-600';
  }
};

export default function RehearsalsPage() {
  const [rehearsals, setRehearsals] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<number, any>>({});

  const [getRehearsals, { data, loading, error, refetch }] = useLazyQuery(GET_ALL_REHEARSALS, {
    fetchPolicy: 'no-cache',
  });

  const [getStats] = useLazyQuery(GET_REHEARSAL_ATTENDANCE_STATS);
  const [deleteRehearsal] = useMutation(DELETE_REHEARSAL);

  useEffect(() => {
    getRehearsals();
  }, [getRehearsals]);

  useEffect(() => {
    if (data) {
      const rehearsalsData = (data as any)?.Rehearsal?.getAll || [];
      setRehearsals(rehearsalsData);
      
      // Obtener estadísticas para cada repaso
      rehearsalsData.forEach(async (rehearsal: any) => {
        try {
          const { data: statsData } = await getStats({
            variables: { rehearsalId: rehearsal.id }
          });
          if ((statsData as any)?.Rehearsal?.getAttendanceStats) {
            setStats(prev => ({
              ...prev,
              [rehearsal.id]: (statsData as any).Rehearsal.getAttendanceStats
            }));
          }
        } catch (err) {
          console.error('Error fetching stats:', err);
        }
      });
    }
  }, [data, getStats]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este repaso?')) return;

    try {
      const { data: result } = await deleteRehearsal({
        variables: { id }
      });

      if ((result as any)?.Rehearsal?.delete?.code === 200) {
        toast.success('Repaso eliminado exitosamente');
        refetch();
      } else {
        toast.error((result as any)?.Rehearsal?.delete?.message || 'Error al eliminar repaso');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar repaso');
    }
  };

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
              <p className="text-destructive">Error al cargar repasos: {error.message}</p>
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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Repasos de Coros Unidos</h1>
            <Link href="/rehearsals/create">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear Repaso
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rehearsals.map((rehearsal) => (
              <Card key={rehearsal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {format(new Date(rehearsal.date), "PPP", { locale: es })}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(rehearsal.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {rehearsal.description && (
                    <p className="text-sm text-gray-600 mb-2">{rehearsal.description}</p>
                  )}
                  {rehearsal.church && (
                    <p className="text-sm text-gray-500 mb-4">📍 {rehearsal.church.name}</p>
                  )}
                  
                  {stats[rehearsal.id] && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Asistencia</span>
                        <span className="text-sm font-bold">
                          {stats[rehearsal.id].attendancePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${getAttendanceColor(stats[rehearsal.id].attendancePercentage)} h-2 rounded-full transition-all`}
                          style={{ width: `${stats[rehearsal.id].attendancePercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {stats[rehearsal.id].attendedMembers} de {stats[rehearsal.id].totalMembers} miembros
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link href={`/rehearsals/${rehearsal.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Link href={`/rehearsals/${rehearsal.id}/attendance`} className="flex-1">
                      <Button className="w-full">
                        Registrar Asistencia
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rehearsals.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">No hay repasos registrados</p>
                <Link href="/rehearsals/create">
                  <Button className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Crear Primer Repaso
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
