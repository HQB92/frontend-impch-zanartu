'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
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
import { GET_ALL_BANK, GET_ALL_CHURCH } from "@/services/query"
import { CREATE_BANK, DELETE_BANK } from "@/services/mutation"
import { useIsAdmin } from "@/hooks/use-roles"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const BANK_TYPES = ['Depósito', 'Transferencia', 'Retiro', 'Otro'];

export default function BankPage() {
  const isAdmin = useIsAdmin();
  const [movements, setMovements] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [churches, setChurches] = useState<any[]>([]);

  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Depósito',
    comment: '',
    churchId: '',
  });

  const [getBanks, { data, loading, error }] = useLazyQuery(GET_ALL_BANK, { fetchPolicy: 'no-cache' });
  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, { fetchPolicy: 'no-cache' });
  const [createBank, { loading: creating }] = useMutation(CREATE_BANK);
  const [deleteBank] = useMutation(DELETE_BANK);

  const load = () => getBanks({ variables: { churchId: null, mes: null, anio: null } });

  useEffect(() => {
    load();
    if (isAdmin) getChurches();
  }, [getBanks, getChurches, isAdmin]);

  useEffect(() => {
    if (data) setMovements((data as any)?.Bank?.getAll || []);
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
      const res: any = await createBank({
        variables: {
          bank: {
            amount: Number(form.amount),
            date: form.date,
            type: form.type,
            comment: form.comment,
            state: true,
            ...(isAdmin && form.churchId ? { churchId: Number(form.churchId) } : {}),
          },
        },
      });
      const r = res?.data?.Bank?.create;
      if (r?.code === 200) {
        toast.success(r.message || 'Movimiento registrado');
        setOpen(false);
        setForm({ amount: '', date: new Date().toISOString().slice(0, 10), type: 'Depósito', comment: '', churchId: '' });
        load();
      } else {
        toast.error(r?.message || 'Error al registrar movimiento');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este movimiento?')) return;
    try {
      const res: any = await deleteBank({ variables: { id } });
      const r = res?.data?.Bank?.delete;
      if (r?.code === 200) {
        toast.success(r.message || 'Movimiento eliminado');
        load();
      } else {
        toast.error(r?.message || 'Error al eliminar');
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
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

  const total = movements.reduce((s, m) => s + (Number(m.amount) || 0), 0);

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
                <CardTitle>Banco — Depósitos y movimientos</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Movimiento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Movimiento Bancario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto</Label>
                        <Input id="amount" type="number" value={form.amount}
                          onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input id="date" type="date" value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {BANK_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comment">Comentario</Label>
                        <Input id="comment" value={form.comment}
                          onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Detalle del movimiento" />
                      </div>
                      {isAdmin && (
                        <div className="space-y-2">
                          <Label>Iglesia</Label>
                          <Select value={form.churchId} onValueChange={(v) => setForm({ ...form, churchId: v })}>
                            <SelectTrigger><SelectValue placeholder="Selecciona iglesia" /></SelectTrigger>
                            <SelectContent>
                              {churches.map((c) => (<SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>))}
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
                <p className="text-sm text-muted-foreground">Total: <span className="font-medium">${total.toLocaleString('es-CL')}</span></p>
              </div>
              {error ? (
                <p className="text-destructive">Error al cargar movimientos: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Comentario</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No hay movimientos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        movements.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>{m.date || '-'}</TableCell>
                            <TableCell>${(Number(m.amount) || 0).toLocaleString('es-CL')}</TableCell>
                            <TableCell>{m.type || '-'}</TableCell>
                            <TableCell>{m.comment || '-'}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
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
