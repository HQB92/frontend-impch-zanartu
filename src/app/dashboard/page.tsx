'use client';

import { useEffect, useMemo } from "react";
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
import { OverviewBudget } from "@/components/overview/overview-budget"
import { OverviewTotalCustomers } from "@/components/overview/overview-total-customers"
import { OverviewTotalProfit } from "@/components/overview/overview-total-profit"
import { Loader } from "@/components/loader"
import { COUNT_ALL_MEMBERS, GET_ALL_OFFERINGS, GET_ALL_BANK, GET_ALL_CHURCH } from "@/services/query"
import { useIsAdmin } from "@/hooks/use-roles"

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);

const sumAmounts = (items: any[]): number =>
  items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

export default function Page() {
  const isAdmin = useIsAdmin();
  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  const [getCountMembers, { data: membersData, loading: loadingMembers }] = useLazyQuery(COUNT_ALL_MEMBERS, { fetchPolicy: 'no-cache' });
  const [getOfferings, { data: offeringsData, loading: loadingOfferings }] = useLazyQuery(GET_ALL_OFFERINGS, { fetchPolicy: 'no-cache' });
  const [getBank, { data: bankData, loading: loadingBank }] = useLazyQuery(GET_ALL_BANK, { fetchPolicy: 'no-cache' });
  const [getChurches, { data: churchesData }] = useLazyQuery(GET_ALL_CHURCH, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getCountMembers();
    getOfferings({ variables: { user: null, churchId: null, mes, anio } });
    getBank({ variables: { churchId: null, mes, anio } });
    if (isAdmin) getChurches();
  }, [getCountMembers, getOfferings, getBank, getChurches, isAdmin, mes, anio]);

  const offerings = useMemo(() => (offeringsData as any)?.Offering?.getAll || [], [offeringsData]);
  const banks = useMemo(() => (bankData as any)?.Bank?.getAll || [], [bankData]);
  const churches = useMemo(() => (churchesData as any)?.Church?.getAll || [], [churchesData]);

  const totalOfferings = useMemo(() => sumAmounts(offerings), [offerings]);
  const totalBank = useMemo(() => sumAmounts(banks), [banks]);

  // Agrupar por iglesia (solo admin)
  const byChurch = useMemo(() => {
    if (!isAdmin) return [];
    const map = new Map<number, { name: string; offerings: number; bank: number }>();
    churches.forEach((c: any) => map.set(Number(c.id), { name: c.name, offerings: 0, bank: 0 }));

    offerings.forEach((o: any) => {
      const id = Number(o.churchId);
      const row = map.get(id) || { name: `Iglesia ${id}`, offerings: 0, bank: 0 };
      row.offerings += Number(o.amount) || 0;
      map.set(id, row);
    });
    banks.forEach((b: any) => {
      const id = Number(b.churchId);
      const row = map.get(id) || { name: `Iglesia ${id}`, offerings: 0, bank: 0 };
      row.bank += Number(b.amount) || 0;
      map.set(id, row);
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [isAdmin, churches, offerings, banks]);

  const loading = loadingMembers || loadingOfferings || loadingBank;

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
                <OverviewBudget value={formatCLP(totalOfferings)} />
                <OverviewTotalCustomers value={(membersData as any)?.Member?.count || 0} />
                <OverviewTotalProfit value={formatCLP(totalBank)} />
              </div>

              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen por iglesia — {mes}/{anio}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Iglesia</TableHead>
                            <TableHead className="text-right">Ofrendas</TableHead>
                            <TableHead className="text-right">Caja</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {byChurch.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground">
                                Sin datos para este período
                              </TableCell>
                            </TableRow>
                          ) : (
                            byChurch.map((row) => (
                              <TableRow key={row.name}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell className="text-right">{formatCLP(row.offerings)}</TableCell>
                                <TableCell className="text-right">{formatCLP(row.bank)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCLP(row.offerings + row.bank)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="font-medium">Total general</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalOfferings)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalBank)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCLP(totalOfferings + totalBank)}</TableCell>
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
