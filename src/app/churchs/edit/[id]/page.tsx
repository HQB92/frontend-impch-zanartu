'use client';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useParams } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UPDATE_CHURCH } from "@/services/mutation"
import { GET_ALL_CHURCH } from "@/services/query"
import { Loader } from "@/components/loader"
import { toast } from "sonner"

export default function EditChurchPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [getChurch, { data, loading: loadingChurch }] = useLazyQuery(GET_ALL_CHURCH, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (id) {
      getChurch();
    }
  }, [id, getChurch]);

  useEffect(() => {
    if (data) {
      const churches = (data as any)?.Church?.getAll || [];
      const church = churches.find((c: any) => c.id === id);
      if (church) {
        setName(church.name || '');
        setAddress(church.address || '');
      }
    }
  }, [data, id]);

  const [updateChurch, { loading }] = useMutation(UPDATE_CHURCH, {
    onCompleted: (data) => {
      const response = data?.Church?.update;
      if (response?.code === 200) {
        toast.success(response.message || 'Iglesia actualizada exitosamente');
        router.push('/churchs');
      } else {
        toast.error(response?.message || 'Error al actualizar la iglesia');
      }
    },
    onError: (error) => {
      toast.error('Error al actualizar la iglesia: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    await updateChurch({
      variables: {
        id,
        name: name.trim(),
        address: address.trim() || undefined,
      },
    });
  };

  if (loadingChurch) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <Loader />
        </SidebarInset>
      </SidebarProvider>
    );
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
        <div className="flex flex-1 flex-col p-6">
          <Card>
            <CardHeader>
              <CardTitle>Editar Iglesia</CardTitle>
              <CardDescription>
                Modifique los datos de la iglesia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la iglesia"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Dirección de la iglesia"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Iglesia'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
