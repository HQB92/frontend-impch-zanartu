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
import { GET_ALL_EXPENSES, GET_ALL_CHURCH } from "@/services/query"
import { CREATE_EXPENSE, UPDATE_EXPENSE, DELETE_EXPENSE } from "@/services/mutation"
import { useIsAdmin } from "@/hooks/use-roles"
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const EXPENSE_TYPES = ['Servicios', 'Mantención', 'Materiales', 'Compras', 'Otro'];

export default function ExpensesPage() {
  const isAdmin = useIsAdmin();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [churches, setChurches] = useState<any[]>([]);

  const emptyForm = {
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'Compras',
    description: '',
    source: 'CAJA',
    churchId: '',
  };
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (ex: any) => {
    setEditingId(String(ex.id));
    setForm({
      amount: String(ex.amount ?? ''),
      date: ex.date ? String(ex.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
      type: ex.type || 'Compras',
      description: ex.description || '',
      source: ex.source || 'CAJA',
      churchId: ex.churchId ? String(ex.churchId) : '',
    });
    setOpen(true);
  };

  const [getExpenses, { data, loading, error }] = useLazyQuery(GET_ALL_EXPENSES, { fetchPolicy: 'no-cache' });
  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, { fetchPolicy: 'no-cache' });
  const [createExpense, { loading: creating }] = useMutation(CREATE_EXPENSE);
  const [updateExpense, { loading: updating }] = useMutation(UPDATE_EXPENSE);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);

  const loadExpenses = () => getExpenses({ variables: { churchId: null, mes: null, anio: null, source: null } });

  useEffect(() => {
    loadExpenses();
    if (isAdmin) getChurches();
  }, [getExpenses, getChurches, isAdmin]);

  useEffect(() => {
    if (data) setExpenses((data as any)?.Expense?.getAll || []);
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
    const expenseInput = {
      amount: Number(form.amount),
      date: form.date,
      type: form.type,
      description: form.description,
      source: form.source,
      ...(isAdmin && form.churchId ? { churchId: Number(form.churchId) } : {}),
    };
    try {
      let r: any;
      if (editingId) {
        const res: any = await updateExpense({ variables: { id: editingId, expense: expenseInput } });
        r = res?.data?.Expense?.update;
      } else {
        const res: any = await createExpense({ variables: { expense: expenseInput } });
        r = res?.data?.Expense?.create;
      }
      if (r?.code === 200) {
        toast.success(r.message || 'Gasto guardado');
        setOpen(false);
        setEditingId(null);
        setForm(emptyForm);
        loadExpenses();
      } else {
        toast.error(r?.message || 'Error al guardar gasto');
      }
    } catch (e: any) {
      toast.error('Error al guardar gasto: ' + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    try {
      const res: any = await deleteExpense({ variables: { id } });
      const r = res?.data?.Expense?.delete;
      if (r?.code === 200) {
        toast.success(r.message || 'Gasto eliminado');
        loadExpenses();
      } else {
        toast.error(r?.message || 'Error al eliminar');
      }
    } catch (e: any) {
      toast.error('Error al eliminar: ' + e.message);
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

  const totalCaja = expenses.filter((e) => e.source === 'CAJA').reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalBanco = expenses.filter((e) => e.source === 'BANCO').reduce((s, e) => s + (Number(e.amount) || 0), 0);

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
                <CardTitle>Gastos</CardTitle>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreate}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Nuevo Gasto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingId ? 'Editar Gasto' : 'Registrar Gasto'}</DialogTitle>
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
                        <Label>Origen del dinero</Label>
                        <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CAJA">Caja (efectivo)</SelectItem>
                            <SelectItem value="BANCO">Banco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {EXPENSE_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Glosa / Detalle</Label>
                        <Input id="description" value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalle del gasto" />
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
                      <Button onClick={handleSubmit} disabled={creating || updating}>
                        {(creating || updating) ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-6">
                <p className="text-sm text-muted-foreground">Gastos Caja: <span className="font-medium">${totalCaja.toLocaleString('es-CL')}</span></p>
                <p className="text-sm text-muted-foreground">Gastos Banco: <span className="font-medium">${totalBanco.toLocaleString('es-CL')}</span></p>
              </div>
              {error ? (
                <p className="text-destructive">Error al cargar gastos: {error.message}</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Origen</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Glosa</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No hay gastos registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        expenses.map((ex) => (
                          <TableRow key={ex.id}>
                            <TableCell>{ex.date || '-'}</TableCell>
                            <TableCell>${(Number(ex.amount) || 0).toLocaleString('es-CL')}</TableCell>
                            <TableCell>{ex.source === 'BANCO' ? 'Banco' : 'Caja'}</TableCell>
                            <TableCell>{ex.type || '-'}</TableCell>
                            <TableCell>{ex.description || '-'}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEdit(ex)}>
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(ex.id)}>
                                  <TrashIcon className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
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
