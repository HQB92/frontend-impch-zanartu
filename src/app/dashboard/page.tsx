'use client';

import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { OverviewBudget } from "@/components/overview/overview-budget"
import { OverviewTotalCustomers } from "@/components/overview/overview-total-customers"
import { OverviewTotalProfit } from "@/components/overview/overview-total-profit"
import { Loader } from "@/components/loader"
import { COUNT_ALL_MEMBERS, GET_ALL_OFFERINGS, GET_ALL_BANK, GET_ALL_CHURCH, GET_ALL_EXPENSES } from "@/services/query"
import { useIsAdmin } from "@/hooks/use-roles"

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);

const sumAmounts = (items: any[]): number =>
  items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function Page() {
  const isAdmin = useIsAdmin();

  // 'all' = histórico (por defecto). Año desde 2026 al actual.
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = 2026; y <= Math.max(2026, currentYear); y++) years.push(y);

  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const anio = filterYear === 'all' ? null : Number(filterYear);
  const mes = filterYear === 'all' || filterMonth === 'all' ? null : Number(filterMonth);

  const [getCountMembers, { data: membersData, loading: loadingMembers }] = useLazyQuery(COUNT_ALL_MEMBERS, { fetchPolicy: 'no-cache' });
  const [getOfferings, { data: offeringsData, loading: loadingOfferings }] = useLazyQuery(GET_ALL_OFFERINGS, { fetchPolicy: 'no-cache' });
  const [getBank, { data: bankData, loading: loadingBank }] = useLazyQuery(GET_ALL_BANK, { fetchPolicy: 'no-cache' });
  const [getExpenses, { data: expensesData, loading: loadingExpenses }] = useLazyQuery(GET_ALL_EXPENSES, { fetchPolicy: 'no-cache' });
  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    // Default histórico (mes/anio null). Selector estrecha por año/mes.
    getCountMembers();
    getOfferings({ variables: { user: null, churchId: null, mes, anio } });
    getBank({ variables: { churchId: null, mes, anio } });
    getExpenses({ variables: { churchId: null, mes, anio, source: null } });
    if (isAdmin) getChurches();
  }, [getCountMembers, getOfferings, getBank, getExpenses, getChurches, isAdmin, mes, anio]);

  const offerings = useMemo(() => (offeringsData as any)?.Offering?.getAll || [], [offeringsData]);
  const banks = useMemo(() => (bankData as any)?.Bank?.getAll || [], [bankData]);
  const expenses = useMemo(() => (expensesData as any)?.Expense?.getAll || [], [expensesData]);
  const churches = useMemo(() => (churchesData as any)?.Church?.getAll || [], [churchesData]);

  const totalOfferings = useMemo(() => sumAmounts(offerings), [offerings]);
  const totalDeposits = useMemo(() => sumAmounts(banks), [banks]);
  const totalExpCaja = useMemo(() => sumAmounts(expenses.filter((e: any) => e.source === 'CAJA')), [expenses]);
  const totalExpBanco = useMemo(() => sumAmounts(expenses.filter((e: any) => e.source === 'BANCO')), [expenses]);

  // Caja = Ofrendas − GastoCaja ; Banco = Depósitos − GastoBanco
  const totalCaja = totalOfferings - totalExpCaja;
  const totalBanco = totalDeposits - totalExpBanco;

  const byChurch = useMemo(() => {
    if (!isAdmin) return [];
    const map = new Map<number, { name: string; ofrendas: number; deposito: number; gastoCaja: number; gastoBanco: number }>();
    churches.forEach((c: any) => map.set(Number(c.id), { name: c.name, ofrendas: 0, deposito: 0, gastoCaja: 0, gastoBanco: 0 }));

    const ensure = (id: number) => {
      if (!map.has(id)) map.set(id, { name: `Iglesia ${id}`, ofrendas: 0, deposito: 0, gastoCaja: 0, gastoBanco: 0 });
      return map.get(id)!;
    };

    offerings.forEach((o: any) => { ensure(Number(o.churchId)).ofrendas += Number(o.amount) || 0; });
    banks.forEach((b: any) => { ensure(Number(b.churchId)).deposito += Number(b.amount) || 0; });
    expenses.forEach((e: any) => {
      const row = ensure(Number(e.churchId));
      if (e.source === 'BANCO') row.gastoBanco += Number(e.amount) || 0;
      else row.gastoCaja += Number(e.amount) || 0;
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [isAdmin, churches, offerings, banks, expenses]);

  const loading = loadingMembers || loadingOfferings || loadingBank || loadingExpenses;

  if (loading) return <Loader />;

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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewBudget value={formatCLP(totalCaja)} />
                <OverviewTotalCustomers value={(membersData as any)?.Member?.count || 0} />
                <OverviewTotalProfit value={formatCLP(totalBanco)} />
              </div>

              {isAdmin && (
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <CardTitle>
                        Resumen por iglesia — {filterYear === 'all'
                          ? 'Histórico total'
                          : filterMonth === 'all'
                            ? `Año ${filterYear}`
                            : `${MESES[Number(filterMonth) - 1]} ${filterYear}`}
                      </CardTitle>
                      <div className="flex gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Año</Label>
                          <Select value={filterYear} onValueChange={(v) => { setFilterYear(v); if (v === 'all') setFilterMonth('all'); }}>
                            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Histórico</SelectItem>
                              {years.map((y) => (<SelectItem key={y} value={String(y)}>{y}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Mes</Label>
                          <Select value={filterMonth} onValueChange={setFilterMonth} disabled={filterYear === 'all'}>
                            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todo el año</SelectItem>
                              {MESES.map((m, i) => (<SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Iglesia</TableHead>
                            <TableHead className="text-right">Ofrendas</TableHead>
                            <TableHead className="text-right">Gasto Caja</TableHead>
                            <TableHead className="text-right">Caja</TableHead>
                            <TableHead className="text-right">Depósitos</TableHead>
                            <TableHead className="text-right">Gasto Banco</TableHead>
                            <TableHead className="text-right">Banco</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {byChurch.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center text-muted-foreground">
                                Sin datos para este período
                              </TableCell>
                            </TableRow>
                          ) : (
                            byChurch.map((r) => (
                              <TableRow key={r.name}>
                                <TableCell>{r.name}</TableCell>
                                <TableCell className="text-right">{formatCLP(r.ofrendas)}</TableCell>
                                <TableCell className="text-right">{formatCLP(r.gastoCaja)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCLP(r.ofrendas - r.gastoCaja)}</TableCell>
                                <TableCell className="text-right">{formatCLP(r.deposito)}</TableCell>
                                <TableCell className="text-right">{formatCLP(r.gastoBanco)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCLP(r.deposito - r.gastoBanco)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="font-medium">Total</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalOfferings)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalExpCaja)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalCaja)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalDeposits)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalExpBanco)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalBanco)}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
