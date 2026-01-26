'use client';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader } from "@/components/loader"
import { CREATE_MEMBER } from "@/services/mutation"
import { GET_ALL_CHURCH, GET_ALL_STATUS } from "@/services/query"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterMemberPage() {
  const router = useRouter();
  const [member, setMember] = useState({
    rut: '',
    names: '',
    lastNameDad: '',
    lastNameMom: '',
    dateOfBirth: '',
    address: '',
    telephone: '',
    mobile: '',
    email: '',
    maritalStatus: '',
    probationStartDate: '',
    fullMembershipDate: '',
    churchId: '',
    statusId: '',
    sexo: '',
  });

  const [churches, setChurches] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [rutError, setRutError] = useState<string | undefined>(undefined);

  const [createMember, { data, loading, error }] = useMutation(CREATE_MEMBER);
  const [getChurches] = useLazyQuery(GET_ALL_CHURCH);
  const [getStatuses] = useLazyQuery(GET_ALL_STATUS);

  useEffect(() => {
    getChurches().then(({ data }) => {
      if ((data as any)?.Church?.getAll) {
        setChurches((data as any).Church.getAll);
      }
    });
    getStatuses().then(({ data }) => {
      if ((data as any)?.Status?.getAll) {
        setStatuses((data as any).Status.getAll);
      }
    });
  }, [getChurches, getStatuses]);

  useEffect(() => {
    if (data) {
      const response = (data as any)?.Member?.create;
      if (response?.code === 200 || response?.code === 201) {
        toast.success(response.message || 'Miembro registrado exitosamente');
        setTimeout(() => {
          router.push('/members');
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldsToTitleCase = ['names', 'lastNameDad', 'lastNameMom', 'address'];
    
    let newValue = value;
    if (fieldsToTitleCase.includes(name)) {
      newValue = toTitleCase(value);
    } else if (name === 'rut') {
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
          setRutError(isValid ? undefined : 'RUT inválido');
        } catch {
          setRutError('RUT inválido');
        }
      } else if (newValue.length > 0) {
        // Limpiar error si aún no está completo
        setRutError(undefined);
      } else {
        setRutError(undefined);
      }
    }

    setMember(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar RUT antes de enviar
    let rutValid = false;
    
    if (member.rut) {
      try {
        const rut = new Rut(member.rut);
        rutValid = rut.isValid;
      } catch {
        rutValid = false;
      }
    }
    
    if (!rutValid) {
      setRutError('RUT inválido');
      toast.error('Por favor, ingresa un RUT válido.');
      return;
    }
    
    // Validar campos requeridos
    if (!member.rut || !member.names || !member.lastNameDad || !member.lastNameMom || 
        !member.dateOfBirth || !member.address || !member.telephone || !member.mobile || 
        !member.email || !member.maritalStatus || !member.sexo) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    try {
      await createMember({
        variables: {
          member: {
            ...member,
            churchId: member.churchId || null,
            statusId: member.statusId || null,
            probationStartDate: member.probationStartDate || null,
            fullMembershipDate: member.fullMembershipDate || null,
            isCorosUnidos: false, // Por defecto false para registro normal
          }
        }
      });
    } catch (err) {
      console.error('Error creating member:', err);
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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Miembro</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Error al registrar miembro: {error.message}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rut">RUT *</Label>
                    <Input
                      id="rut"
                      name="rut"
                      value={member.rut}
                      onChange={handleChange}
                      required
                      placeholder="12345678-9"
                      className={rutError ? "border-destructive" : ""}
                    />
                    {rutError && (
                      <p className="text-sm text-destructive">{rutError}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="names">Nombres *</Label>
                    <Input
                      id="names"
                      name="names"
                      value={member.names}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastNameDad">Apellido Paterno *</Label>
                    <Input
                      id="lastNameDad"
                      name="lastNameDad"
                      value={member.lastNameDad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastNameMom">Apellido Materno *</Label>
                    <Input
                      id="lastNameMom"
                      name="lastNameMom"
                      value={member.lastNameMom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={member.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo *</Label>
                    <Select value={member.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Estado Civil *</Label>
                    <Select value={member.maritalStatus} onValueChange={(value) => handleSelectChange('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soltero">Soltero</SelectItem>
                        <SelectItem value="Casado">Casado</SelectItem>
                        <SelectItem value="Divorciado">Divorciado</SelectItem>
                        <SelectItem value="Viudo">Viudo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={member.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Teléfono *</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={member.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Celular *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={member.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={member.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="churchId">Iglesia</Label>
                    <Select value={member.churchId || undefined} onValueChange={(value) => handleSelectChange('churchId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una iglesia (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={church.id.toString()}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statusId">Estado</Label>
                    <Select value={member.statusId || undefined} onValueChange={(value) => handleSelectChange('statusId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.id.toString()}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="probationStartDate">Fecha Inicio Prueba</Label>
                    <Input
                      id="probationStartDate"
                      name="probationStartDate"
                      type="date"
                      value={member.probationStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullMembershipDate">Fecha Membresía Completa</Label>
                    <Input
                      id="fullMembershipDate"
                      name="fullMembershipDate"
                      type="date"
                      value={member.fullMembershipDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Miembro'}
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
  );
}
