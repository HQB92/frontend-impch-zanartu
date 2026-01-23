'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
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
import Rut from "rutjs"
import { toTitleCase } from "@/lib/utils"

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
  const [rutErrors, setRutErrors] = useState<{ husbandId?: string; wifeId?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldsToTitleCase = ['fullNameHusband', 'fullNameWife', 'civilPlace'];
    
    let newValue = value;
    if (fieldsToTitleCase.includes(name)) {
      newValue = toTitleCase(value);
    } else if (name === 'civilCode' && value !== '') {
      newValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'husbandId' || name === 'wifeId') {
      // Formatear RUT mientras se escribe usando rutjs
      // Limpiar puntos y espacios, mantener solo números y guión/dígito verificador
      const cleanValue = value.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
      
      if (cleanValue.length > 0) {
        try {
          // Si tiene guión o tiene 8+ caracteres (incluyendo dígito verificador), formatear
          if (cleanValue.includes('-') || cleanValue.length >= 8) {
            const rut = new Rut(cleanValue);
            newValue = rut.getNiceRut();
          } else {
            // Si aún no tiene formato completo, dejar como está
            newValue = cleanValue;
          }
        } catch {
          newValue = cleanValue;
        }
      } else {
        newValue = '';
      }
      
      // Validar RUT si tiene formato completo (con guión)
      if (newValue && newValue.includes('-')) {
        try {
          const rut = new Rut(newValue);
          const isValid = rut.isValid;
          setRutErrors(prev => ({
            ...prev,
            [name]: isValid ? undefined : 'RUT inválido'
          }));
        } catch {
          setRutErrors(prev => ({
            ...prev,
            [name]: 'RUT inválido'
          }));
        }
      } else if (newValue.length > 0) {
        // Limpiar error si aún no está completo
        setRutErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      } else {
        setRutErrors(prev => ({
          ...prev,
          [name]: undefined
        }));
      }
    }

    setMerriage(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar RUTs antes de enviar
    let husbandRutValid = false;
    let wifeRutValid = false;
    
    if (merriage.husbandId) {
      try {
        const rut = new Rut(merriage.husbandId);
        husbandRutValid = rut.isValid;
      } catch {
        husbandRutValid = false;
      }
    }
    
    if (merriage.wifeId) {
      try {
        const rut = new Rut(merriage.wifeId);
        wifeRutValid = rut.isValid;
      } catch {
        wifeRutValid = false;
      }
    }
    
    if (!husbandRutValid || !wifeRutValid) {
      setRutErrors({
        husbandId: husbandRutValid ? undefined : 'RUT inválido',
        wifeId: wifeRutValid ? undefined : 'RUT inválido'
      });
      alert('Por favor, ingresa RUTs válidos.');
      return;
    }
    
    // Validar que todos los campos requeridos tengan valores
    const trimmedHusbandId = merriage.husbandId?.trim() || '';
    const trimmedFullNameHusband = merriage.fullNameHusband?.trim() || '';
    const trimmedWifeId = merriage.wifeId?.trim() || '';
    const trimmedFullNameWife = merriage.fullNameWife?.trim() || '';
    const trimmedCivilPlace = merriage.civilPlace?.trim() || '';
    
    if (!trimmedHusbandId || !trimmedFullNameHusband || !trimmedWifeId || 
        !trimmedFullNameWife || !merriage.civilCode || !merriage.civilDate || 
        !trimmedCivilPlace || !merriage.religiousDate) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    try {
      const merriageRecord = {
        husbandId: trimmedHusbandId,
        fullNameHusband: trimmedFullNameHusband,
        wifeId: trimmedWifeId,
        fullNameWife: trimmedFullNameWife,
        civilCode: parseInt(merriage.civilCode),
        civilDate: merriage.civilDate,
        civilPlace: trimmedCivilPlace,
        religiousDate: merriage.religiousDate
      };
      
      console.log('Estado merriage:', merriage);
      console.log('Enviando datos:', merriageRecord);
      
      await createMerriage({
        variables: { 
          merriageRecord
        }
      });
    } catch (err) {
      console.error('Error creating marriage:', err);
    }
  };

  useEffect(() => {
    if (data) {
      const response = (data as any)?.MerriageRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Matrimonio registrado exitosamente');
        setTimeout(() => {
          router.push('/merriage');
          // Forzar recarga de la página de listado
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  if (loading) return (
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
                      className={rutErrors.husbandId ? "border-destructive" : ""}
                    />
                    {rutErrors.husbandId && (
                      <p className="text-sm text-destructive">{rutErrors.husbandId}</p>
                    )}
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
                      className={rutErrors.wifeId ? "border-destructive" : ""}
                    />
                    {rutErrors.wifeId && (
                      <p className="text-sm text-destructive">{rutErrors.wifeId}</p>
                    )}
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
