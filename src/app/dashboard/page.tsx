'use client';

import { useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { OverviewBudget } from "@/components/overview/overview-budget"
import { OverviewTotalCustomers } from "@/components/overview/overview-total-customers"
import { OverviewTotalProfit } from "@/components/overview/overview-total-profit"
import { Loader } from "@/components/loader"
import { COUNT_ALL_MEMBERS, GET_ALL_OFFERINGS, GET_ALL_BANK } from "@/services/query"

const formatCLP = (amount: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);

const sumAmounts = (items: any[]): number =>
  items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

export default function Page() {
  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  const [getCountMembers, { data: membersData, loading: loadingMembers }] = useLazyQuery(COUNT_ALL_MEMBERS, { fetchPolicy: 'no-cache' });
  const [getOfferings, { data: offeringsData, loading: loadingOfferings }] = useLazyQuery(GET_ALL_OFFERINGS, { fetchPolicy: 'no-cache' });
  const [getBank, { data: bankData, loading: loadingBank }] = useLazyQuery(GET_ALL_BANK, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getCountMembers();
    getOfferings({ variables: { user: null, churchId: null, mes, anio } });
    getBank({ variables: { churchId: null, mes, anio } });
  }, [getCountMembers, getOfferings, getBank, mes, anio]);

  const totalOfferings = useMemo(() => {
    const items = (offeringsData as any)?.Offering?.getAll || [];
    return sumAmounts(items);
  }, [offeringsData]);

  const totalBank = useMemo(() => {
    const items = (bankData as any)?.Bank?.getAll || [];
    return sumAmounts(items);
  }, [bankData]);

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
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
