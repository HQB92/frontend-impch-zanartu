'use client';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from "sonner";
import { toTitleCase } from "@/lib/utils";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader } from "@/components/loader"
import { UPDATE_MEMBER } from "@/services/mutation"
import { GET_ALL_CHURCH, GET_ALL_STATUS, GET_MEMBER_BY_RUT } from "@/services/query"

const empty = {
  rut: '', names: '', lastNameDad: '', lastNameMom: '', dateOfBirth: '',
  address: '', telephone: '', mobile: '', email: '', maritalStatus: '',
  probationStartDate: '', fullMembershipDate: '', churchId: '', statusId: '', sexo: '',
  isCorosUnidos: false,
};

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const rut = decodeURIComponent(String(params.rut || ''));

  const [member, setMember] = useState<any>(empty);
  const [churches, setChurches] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [getMember] = useLazyQuery(GET_MEMBER_BY_RUT, { fetchPolicy: 'no-cache' });
  const [getChurches] = useLazyQuery(GET_ALL_CHURCH);
  const [getStatuses] = useLazyQuery(GET_ALL_STATUS);
  const [updateMember, { loading: saving }] = useMutation(UPDATE_MEMBER);

  useEffect(() => {
    getChurches().then(({ data }) => setChurches((data as any)?.Church?.getAll || []));
    getStatuses().then(({ data }) => setStatuses((data as any)?.Status?.getAll || []));
    getMember({ variables: { rut } }).then(({ data }) => {
      const m = (data as any)?.Member?.getByRut;
      if (m) {
        setMember({
          rut: m.rut || rut,
          names: m.names || '',
          lastNameDad: m.lastNameDad || '',
          lastNameMom: m.lastNameMom || '',
          dateOfBirth: m.dateOfBirth ? String(m.dateOfBirth).slice(0, 10) : '',
          address: m.address || '',
          telephone: m.telephone || '',
          mobile: m.mobile || '',
          email: m.email || '',
          maritalStatus: m.maritalStatus || '',
          probationStartDate: m.probationStartDate ? String(m.probationStartDate).slice(0, 10) : '',
          fullMembershipDate: m.fullMembershipDate ? String(m.fullMembershipDate).slice(0, 10) : '',
          churchId: m.churchId ? String(m.churchId) : '',
          statusId: m.statusId ? String(m.statusId) : '',
          sexo: m.sexo || '',
          isCorosUnidos: !!m.isCorosUnidos,
        });
      }
      setLoaded(true);
    });
  }, [rut, getMember, getChurches, getStatuses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const titleCaseFields = ['names', 'lastNameDad', 'lastNameMom', 'address'];
    setMember((prev: any) => ({ ...prev, [name]: titleCaseFields.includes(name) ? toTitleCase(value) : value }));
  };
  const handleSelect = (name: string, value: string) => setMember((prev: any) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await updateMember({
        variables: {
          member: {
            ...member,
            churchId: member.churchId || null,
            statusId: member.statusId || null,
            probationStartDate: member.probationStartDate || null,
            fullMembershipDate: member.fullMembershipDate || null,
          },
        },
      });
      const r = res?.data?.Member?.update;
      if (r?.code === 200) {
        toast.success(r.message || 'Miembro actualizado');
        router.push('/members');
      } else {
        toast.error(r?.message || 'Error al actualizar');
      }
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    }
  };

  if (!loaded) return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset><SiteHeader /><Loader /></SidebarInset>
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
              <CardTitle>Editar Miembro — {member.rut}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="names">Nombres</Label>
                  <Input id="names" name="names" value={member.names} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastNameDad">Apellido Paterno</Label>
                    <Input id="lastNameDad" name="lastNameDad" value={member.lastNameDad} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastNameMom">Apellido Materno</Label>
                    <Input id="lastNameMom" name="lastNameMom" value={member.lastNameMom} onChange={handleChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" value={member.dateOfBirth} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Sexo</Label>
                    <Select value={member.sexo} onValueChange={(v) => handleSelect('sexo', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Select value={member.maritalStatus} onValueChange={(v) => handleSelect('maritalStatus', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
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
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={member.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Teléfono</Label>
                    <Input id="telephone" name="telephone" type="tel" value={member.telephone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Celular</Label>
                    <Input id="mobile" name="mobile" type="tel" value={member.mobile} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={member.email} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Iglesia</Label>
                    <Select value={member.churchId || undefined} onValueChange={(v) => handleSelect('churchId', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                      <SelectContent>
                        {churches.map((c) => (<SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={member.statusId || undefined} onValueChange={(v) => handleSelect('statusId', v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (<SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="probationStartDate">Fecha Inicio Prueba</Label>
                    <Input id="probationStartDate" name="probationStartDate" type="date" value={member.probationStartDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullMembershipDate">Fecha Membresía Completa</Label>
                    <Input id="fullMembershipDate" name="fullMembershipDate" type="date" value={member.fullMembershipDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
