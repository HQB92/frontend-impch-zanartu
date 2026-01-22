"use client"

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRoles } from "@/hooks/use-roles"
import { sidebarItems } from "@/config/sidebar-config"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const roles = useRoles()

  // Filtrar items según roles del usuario
  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.some((role) => roles.includes(role))
  )

  // Agregar Dashboard al inicio
  const DashboardIcon = () => (
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )

  const navItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: DashboardIcon,
    },
    ...filteredItems,
  ]

  const userData = {
    name: user?.name || "Usuario",
    email: user?.email || "",
    avatar: user?.avatar || "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-15 rounded bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">IMPCH</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">Zañartu</span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
