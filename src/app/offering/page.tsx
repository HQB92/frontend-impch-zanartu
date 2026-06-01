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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader } from "@/components/loader"
import { GET_ALL_OFFERINGS, GET_ALL_CHURCH } from "@/services/query"
import { CREATE_OFFERING, DELETE_OFFERING } from "@/services/mutation"
import { useIsAdmin } from "@/hooks/use-roles"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const OFFERING_TYPES = ['Diezmo', 'Ofrenda', 'Pro-templo', 'Misiones', 'Otro'];

export default function OfferingPage() {
  const isAdmin = useIsAdmin();
  const [offerings, setOfferings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [churches, setChurches] = useState<any[]>([]);

  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Ofrenda',
    churchId: '',
  });

  const [getOfferings, { data, loading, error }] = useLazyQuery(GET_ALL_OFFERINGS, {
    fetchPolicy: 'no-cache',
  });
  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, { fetchPolicy: 'no-cache' });
  const [createOffering, { loading: creating }] = useMutation(CREATE_OFFERING);
  const [deleteOffering] = useMutation(DELETE_OFFERING);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta ofrenda?')) return;
    try {
      const res: any = await deleteOffering({ variables: { id: Number(id) } });
      const r = res?.data?.Offering?.delete;
      if (r?.code === 200) {
        toast.success(r.message || 'Ofrenda eliminada');
        loadOfferings();
      } else {
        toast.error(r?.message || 'Error al eliminar');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  };

  const loadOfferings = () => getOfferings({ variables: { user: null, churchId: null, mes: null, anio: null } });

  useEffect(() => {
    loadOfferings();
    if (isAdmin) getChurches();
  }, [getOfferings, getChurches, isAdmin]);

  useEffect(() => {
    if (data) setOfferings((data as any)?.Offering?.getAll || []);
  }, [data]);

  useEffect(() => {
    if (churchesData) setChurches((churchesData as any)?.Church?.getAll || []);
  }, [churchesData]);

  const handleSubmit = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }
    if (isAdmin && !form.churchId) {
      toast.error('Selecciona una iglesia');
      return;
    }
    try {
      const res: any = await createOffering({
        variables: {
          offering: {
            amount: Number(form.amount),
            date: form.date,
            type: form.type,
            state: true,
            ...(isAdmin && form.churchId ? { churchId: Number(form.churchId) } : {}),
          },
        },
      });
      const r = res?.data?.Offering?.create;
      if (r?.code === 200 || r?.code === 201) {
        toast.success(r.message || 'Ofrenda registrada');
        setOpen(false);
        setForm({ amount: '', date: new Date().toISOString().slice(0, 10), type: 'Ofrenda', churchId: '' });
        loadOfferings();
      } else {
        toast.error(r?.message || 'Error al registrar ofrenda');
      }
    } catch (e: any) {
      toast.error('Error al registrar ofrenda: ' + e.message);
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

  const totalAmount = offerings.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

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
        <div className="flex flex-1 flex-col p-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ofrendas</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nueva Ofrenda
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Ofrenda</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {OFFERING_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {isAdmin && (
                        <div className="space-y-2">
                          <Label>Iglesia</Label>
                          <Select value={form.churchId} onValueChange={(v) => setForm({ ...form, churchId: v })}>
                            <SelectTrigger><SelectValue placeholder="Selecciona iglesia" /></SelectTrigger>
                            <SelectContent>
                              {churches.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                      <Button onClick={handleSubmit} disabled={creating}>
                        {creating ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Total: ${totalAmount.toLocaleString('es-CL')}</p>
              </div>
              {error ? (
                <p className="text-destructive">Error al cargar ofrendas: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offerings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No hay ofrendas disponibles
                          </TableCell>
                        </TableRow>
                      ) : (
                        offerings.map((offering) => (
                          <TableRow key={offering.id}>
                            <TableCell>{offering.date || '-'}</TableCell>
                            <TableCell>${(parseFloat(offering.amount) || 0).toLocaleString('es-CL')}</TableCell>
                            <TableCell>{offering.type || '-'}</TableCell>
                            <TableCell>{offering.state ? 'Activo' : 'Inactivo'}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(offering.id)}>
                                <TrashIcon className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
