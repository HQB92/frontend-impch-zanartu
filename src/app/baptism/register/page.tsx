'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import Rut from "rutjs";
import { toTitleCase } from "@/lib/utils";
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
import { CREATE_BAPTISM } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterBaptismPage() {
  const router = useRouter();
  const [baptism, setBaptism] = useState({
    childRUT: '',
    childFullName: '',
    childDateOfBirth: '',
    fatherRUT: '',
    fatherFullName: '',
    motherRUT: '',
    motherFullName: '',
    placeOfRegistration: '',
    baptismDate: '',
    registrationNumber: '',
    registrationDate: '',
  });

  const [createBaptism, { data, loading, error }] = useMutation(CREATE_BAPTISM);
  const [rutErrors, setRutErrors] = useState<{ childRUT?: string; fatherRUT?: string; motherRUT?: string }>({});

  useEffect(() => {
    if (data) {
      const response = (data as any)?.BaptismRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Bautizo registrado exitosamente');
        setTimeout(() => {
          router.push('/baptism');
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldsToTitleCase = ['childFullName', 'fatherFullName', 'motherFullName', 'placeOfRegistration'];
    const rutFields = ['childRUT', 'fatherRUT', 'motherRUT'];
    
    let newValue = value;
    if (fieldsToTitleCase.includes(name)) {
      newValue = toTitleCase(value);
    } else if (name === 'registrationNumber' && value !== '') {
      newValue = value.replace(/[^0-9]/g, '');
    } else if (rutFields.includes(name)) {
      // Formatear RUT mientras se escribe usando rutjs
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

    setBaptism(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar RUTs antes de enviar (solo si tienen valor)
    let childRutValid = true;
    let fatherRutValid = true;
    let motherRutValid = true;
    
    if (baptism.childRUT) {
      try {
        const rut = new Rut(baptism.childRUT);
        childRutValid = rut.isValid;
      } catch {
        childRutValid = false;
      }
    }
    
    if (baptism.fatherRUT) {
      try {
        const rut = new Rut(baptism.fatherRUT);
        fatherRutValid = rut.isValid;
      } catch {
        fatherRutValid = false;
      }
    }
    
    if (baptism.motherRUT) {
      try {
        const rut = new Rut(baptism.motherRUT);
        motherRutValid = rut.isValid;
      } catch {
        motherRutValid = false;
      }
    }
    
    if (!childRutValid || !fatherRutValid || !motherRutValid) {
      setRutErrors({
        childRUT: childRutValid ? undefined : 'RUT inválido',
        fatherRUT: fatherRutValid ? undefined : 'RUT inválido',
        motherRUT: motherRutValid ? undefined : 'RUT inválido'
      });
      alert('Por favor, ingresa RUTs válidos.');
      return;
    }
    
    try {
      await createBaptism({
        variables: { baptismRecord: baptism }
      });
    } catch (err) {
      console.error('Error creating baptism:', err);
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
              <CardTitle>Registrar Bautizo</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Error al registrar bautizo: {error.message}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childRUT">RUT Niño *</Label>
                    <Input
                      id="childRUT"
                      name="childRUT"
                      value={baptism.childRUT}
                      onChange={handleChange}
                      required
                      placeholder="12345678-9"
                      className={rutErrors.childRUT ? "border-destructive" : ""}
                    />
                    {rutErrors.childRUT && (
                      <p className="text-sm text-destructive">{rutErrors.childRUT}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="childFullName">Nombre Completo del Niño *</Label>
                    <Input
                      id="childFullName"
                      name="childFullName"
                      value={baptism.childFullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childDateOfBirth">Fecha de Nacimiento del Niño *</Label>
                    <Input
                      id="childDateOfBirth"
                      name="childDateOfBirth"
                      type="date"
                      value={baptism.childDateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherRUT">RUT Padre</Label>
                    <Input
                      id="fatherRUT"
                      name="fatherRUT"
                      value={baptism.fatherRUT}
                      onChange={handleChange}
                      placeholder="12345678-9"
                      className={rutErrors.fatherRUT ? "border-destructive" : ""}
                    />
                    {rutErrors.fatherRUT && (
                      <p className="text-sm text-destructive">{rutErrors.fatherRUT}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherFullName">Nombre Completo del Padre</Label>
                    <Input
                      id="fatherFullName"
                      name="fatherFullName"
                      value={baptism.fatherFullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherRUT">RUT Madre</Label>
                    <Input
                      id="motherRUT"
                      name="motherRUT"
                      value={baptism.motherRUT}
                      onChange={handleChange}
                      placeholder="12345678-9"
                      className={rutErrors.motherRUT ? "border-destructive" : ""}
                    />
                    {rutErrors.motherRUT && (
                      <p className="text-sm text-destructive">{rutErrors.motherRUT}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherFullName">Nombre Completo de la Madre</Label>
                    <Input
                      id="motherFullName"
                      name="motherFullName"
                      value={baptism.motherFullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baptismDate">Fecha de Bautismo *</Label>
                    <Input
                      id="baptismDate"
                      name="baptismDate"
                      type="date"
                      value={baptism.baptismDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfRegistration">Lugar de Registro</Label>
                    <Input
                      id="placeOfRegistration"
                      name="placeOfRegistration"
                      value={baptism.placeOfRegistration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Número de Registro</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={baptism.registrationNumber}
                      onChange={handleChange}
                      placeholder="Solo números"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationDate">Fecha de Registro</Label>
                    <Input
                      id="registrationDate"
                      name="registrationDate"
                      type="date"
                      value={baptism.registrationDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Bautizo'}
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
