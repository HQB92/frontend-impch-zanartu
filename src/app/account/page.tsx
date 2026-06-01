'use client';

import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { GET_PROFILE } from "@/services/query"

export default function AccountPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null);
  const [getProfile] = useLazyQuery(GET_PROFILE, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (user?.rut) {
      getProfile({ variables: { rut: user.rut } }).then(({ data }) => {
        setProfile((data as any)?.Member?.getByRut || null);
      });
    }
  }, [user?.rut, getProfile]);

  const fullName = profile
    ? [profile.names, profile.lastNameDad, profile.lastNameMom].filter(Boolean).join(' ')
    : user?.name;

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
        <div className="flex flex-1 flex-col p-6">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p className="text-lg">{fullName || 'No disponible'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{profile?.email || user?.email || 'No disponible'}</p>
              </div>
              {user?.rut && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">RUT</p>
                  <p className="text-lg">{user.rut}</p>
                </div>
              )}
              {profile?.mobile && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Celular</p>
                  <p className="text-lg">{profile.mobile}</p>
                </div>
              )}
              {profile?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p className="text-lg">{profile.address}</p>
                </div>
              )}
              {user?.roles && user.roles.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Roles</p>
                  <p className="text-lg">{user.roles.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
