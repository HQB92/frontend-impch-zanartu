'use client';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CREATE_REHEARSAL } from "@/services/mutation"
import { GET_ALL_CHURCH } from "@/services/query"
import { toast } from "sonner"

export default function CreateRehearsalPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [churchId, setChurchId] = useState('');
  const [churches, setChurches] = useState<any[]>([]);

  const [createRehearsal, { loading }] = useMutation(CREATE_REHEARSAL);
  const [getChurches] = useLazyQuery(GET_ALL_CHURCH);

  useEffect(() => {
    getChurches().then(({ data }) => {
      if (data?.Church?.getAll) {
        setChurches(data.Church.getAll);
      }
    });
  }, [getChurches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error('La fecha es requerida');
      return;
    }

    try {
      const { data } = await createRehearsal({
        variables: {
          rehearsal: {
            date,
            description: description || null,
            churchId: churchId || null,
          }
        }
      });

      if (data?.Rehearsal?.create?.code === 200) {
        toast.success('Repaso creado exitosamente');
        router.push('/rehearsals');
      } else {
        toast.error(data?.Rehearsal?.create?.message || 'Error al crear repaso');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear repaso');
    }
  };

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
        <div className="flex flex-1 flex-col p-6 gap-4">
          <h1 className="text-3xl font-bold">Crear Repaso</h1>

          <Card>
            <CardHeader>
              <CardTitle>Información del Repaso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del repaso (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="churchId">Iglesia/Local</Label>
                  <Select value={churchId || undefined} onValueChange={setChurchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una iglesia (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {churches.map((church) => (
                        <SelectItem key={church.id} value={church.id.toString()}>
                          {church.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Repaso'}
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
