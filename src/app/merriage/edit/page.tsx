'use client';

import { useState, useEffect, Suspense } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/loader"
import { GET_ALL_MERRIAGE } from "@/services/query"
import { CREATE_MERRIAGE } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"

function EditMerriageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const marriageId = searchParams.get('id');

  const [merriage, setMerriage] = useState({
    husbandId: '',
    fullNameHusband: '',
    wifeId: '',
    fullNameWife: '',
    civilCode: '',
    civilDate: '',
    civilPlace: '',
    religiousDate: ''
  });

  const [getMarriages, { data: queryData, loading: queryLoading }] = useLazyQuery(GET_ALL_MERRIAGE, {
    fetchPolicy: 'no-cache',
  });

  const [createMerriage, { data, loading, error }] = useMutation(CREATE_MERRIAGE);

  useEffect(() => {
    getMarriages();
  }, [getMarriages]);

  useEffect(() => {
    if (queryData && marriageId) {
      const marriages = (queryData as any)?.MerriageRecord?.getAll || [];
      const marriageData = marriages.find((m: any) => m.id === marriageId);
      if (marriageData) {
        setMerriage({
          husbandId: marriageData.husbandId || '',
          fullNameHusband: marriageData.fullNameHusband || '',
          wifeId: marriageData.wifeId || '',
          fullNameWife: marriageData.fullNameWife || '',
          civilCode: marriageData.civilCode?.toString() || '',
          civilDate: marriageData.civilDate || '',
          civilPlace: marriageData.civilPlace || '',
          religiousDate: marriageData.religiousDate || ''
        });
      }
    }
  }, [queryData, marriageId]);

  useEffect(() => {
    if ((data as any)?.MerriageRecord?.create?.code === 200) {
      setTimeout(() => {
        router.push('/merriage');
      }, 2000);
    }
  }, [data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldsToUppercase = ['fullNameHusband', 'fullNameWife', 'civilPlace'];
    
    let newValue = value;
    if (fieldsToUppercase.includes(name)) {
      newValue = value.toUpperCase();
    } else if (name === 'civilCode' && value !== '') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setMerriage(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merriage.civilDate || !merriage.religiousDate) {
      alert('Por favor, completa todas las fechas requeridas.');
      return;
    }
    try {
      await createMerriage({
        variables: { merriageRecord: { ...merriage, civilCode: merriage.civilCode ? parseInt(merriage.civilCode) : null } }
      });
    } catch (err) {
      console.error('Error updating marriage:', err);
    }
  };

  if (queryLoading || loading) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Loader />
      </SidebarInset>
    </SidebarProvider>
  );

  if (!marriageId) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col p-6">
            <Card>
              <CardContent>
                <p className="text-destructive">No se proporcionó el ID del matrimonio</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
              <CardTitle>Editar Matrimonio</CardTitle>
            </CardHeader>
            <CardContent>
              {(data as any)?.MerriageRecord?.create?.code === 200 && (
                <Alert className="mb-4">
                  <AlertDescription>
                    {(data as any).MerriageRecord.create.message || 'Matrimonio actualizado exitosamente'}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Error al actualizar matrimonio: {error.message}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="husbandId">RUT Esposo *</Label>
                    <Input
                      id="husbandId"
                      name="husbandId"
                      value={merriage.husbandId}
                      onChange={handleChange}
                      required
                      placeholder="12345678-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullNameHusband">Nombre Completo del Esposo *</Label>
                    <Input
                      id="fullNameHusband"
                      name="fullNameHusband"
                      value={merriage.fullNameHusband}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wifeId">RUT Esposa *</Label>
                    <Input
                      id="wifeId"
                      name="wifeId"
                      value={merriage.wifeId}
                      onChange={handleChange}
                      required
                      placeholder="12345678-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullNameWife">Nombre Completo de la Esposa *</Label>
                    <Input
                      id="fullNameWife"
                      name="fullNameWife"
                      value={merriage.fullNameWife}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilCode">Número de Registro *</Label>
                    <Input
                      id="civilCode"
                      name="civilCode"
                      type="number"
                      value={merriage.civilCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilPlace">Lugar de Registro *</Label>
                    <Input
                      id="civilPlace"
                      name="civilPlace"
                      value={merriage.civilPlace}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilDate">Fecha de Matrimonio Civil *</Label>
                    <Input
                      id="civilDate"
                      name="civilDate"
                      type="date"
                      value={merriage.civilDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religiousDate">Fecha de Matrimonio Religioso *</Label>
                    <Input
                      id="religiousDate"
                      name="religiousDate"
                      type="date"
                      value={merriage.religiousDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Matrimonio'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function EditMerriagePage() {
  return (
    <Suspense fallback={
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Loader />
        </SidebarInset>
      </SidebarProvider>
    }>
      <EditMerriageForm />
    </Suspense>
  );
}
