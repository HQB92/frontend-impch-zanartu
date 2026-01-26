'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GET_REHEARSAL_BY_ID, GET_REHEARSAL_ATTENDANCE_STATS } from "@/services/query"
import { Loader } from "@/components/loader"
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

export default function RehearsalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rehearsalId = Number(params.id);
  const [rehearsal, setRehearsal] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const [getRehearsal, { loading: loadingRehearsal }] = useLazyQuery(GET_REHEARSAL_BY_ID);
  const [getStats, { loading: loadingStats }] = useLazyQuery(GET_REHEARSAL_ATTENDANCE_STATS);

  useEffect(() => {
    if (rehearsalId) {
      loadRehearsal();
      loadStats();
    }
  }, [rehearsalId]);

  const loadRehearsal = async () => {
    try {
      const { data } = await getRehearsal({
        variables: { id: rehearsalId }
      });
      setRehearsal((data as any)?.Rehearsal?.getById);
    } catch (err) {
      console.error('Error loading rehearsal:', err);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await getStats({
        variables: { rehearsalId }
      });
      setStats((data as any)?.Rehearsal?.getAttendanceStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  if (loadingRehearsal) return (
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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Detalles del Repaso</h1>
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
          </div>

          {rehearsal && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Información del Repaso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Fecha:</strong> {format(new Date(rehearsal.date), "PPP", { locale: es })}</p>
                    {rehearsal.description && (
                      <p><strong>Descripción:</strong> {rehearsal.description}</p>
                    )}
                    {rehearsal.church && (
                      <p><strong>Iglesia/Local:</strong> {rehearsal.church.name}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {stats && (
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas de Asistencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Porcentaje de Asistencia</span>
                        <span className="text-2xl font-bold">
                          {stats.attendancePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`${getAttendanceColor(stats.attendancePercentage)} h-4 rounded-full transition-all`}
                          style={{ width: `${stats.attendancePercentage}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Miembros Asistentes</p>
                          <p className="text-2xl font-bold">{stats.attendedMembers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total de Miembros</p>
                          <p className="text-2xl font-bold">{stats.totalMembers}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Miembros Asistentes ({rehearsal.attendances?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rehearsal.attendances?.map((attendance: any) => (
                      <div
                        key={attendance.id}
                        className="p-3 border rounded-lg"
                      >
                        <p className="font-medium">
                          {attendance.member?.names} {attendance.member?.lastNameDad} {attendance.member?.lastNameMom}
                        </p>
                        <p className="text-sm text-gray-500">
                          RUT: {attendance.memberRut} - 
                          Registrado: {format(new Date(attendance.attendedAt), "PPp", { locale: es })}
                        </p>
                      </div>
                    ))}
                    {(!rehearsal.attendances || rehearsal.attendances.length === 0) && (
                      <p className="text-center text-gray-500 py-8">No hay asistencias registradas</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => router.push(`/rehearsals/${rehearsalId}/attendance`)}>
                  Registrar Asistencia
                </Button>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
