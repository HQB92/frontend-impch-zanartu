'use client';

import { useEffect } from "react";
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
import { useProfile } from "@/hooks/use-profile"
import { COUNT_ALL_MEMBERS } from "@/services/query"

export default function Page() {
  const [getCountMembers, { data, loading }] = useLazyQuery(COUNT_ALL_MEMBERS, { fetchPolicy: 'no-cache' });
  const { profile, isLoaded } = useProfile();

  useEffect(() => {
    if (isLoaded && profile) {
      getCountMembers();
    }
  }, [isLoaded, profile, getCountMembers]);

  if (loading || !isLoaded) {
    return <Loader />;
  }

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
                <OverviewBudget positive value="$240.000" />
                <OverviewTotalCustomers value={(data as any)?.Member?.count || 0} />
                <OverviewTotalProfit value="$550.000" />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
