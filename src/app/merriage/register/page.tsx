'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
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
import { CREATE_MERRIAGE } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterMerriagePage() {
  const router = useRouter();
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

  const [createMerriage, { data, loading, error }] = useMutation(CREATE_MERRIAGE);

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
      console.error('Error creating marriage:', err);
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

  if ((data as any)?.MerriageRecord?.create?.code === 200) {
    setTimeout(() => {
      router.push('/merriage');
    }, 2000);
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
              <CardTitle>Registrar Matrimonio</CardTitle>
            </CardHeader>
            <CardContent>
              {(data as any)?.MerriageRecord?.create?.code === 200 && (
                <Alert className="mb-4">
                  <AlertDescription>
                    {(data as any).MerriageRecord.create.message || 'Matrimonio registrado exitosamente'}
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Error al registrar matrimonio: {error.message}
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
                    {loading ? 'Registrando...' : 'Registrar Matrimonio'}
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
