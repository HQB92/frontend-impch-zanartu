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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UPDATE_BANK } from "@/services/mutation"
import { GET_ALL_BANK, GET_ALL_CHURCH } from "@/services/query"
import { Loader } from "@/components/loader"
import { toast } from "sonner"

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('');
  const [churchId, setChurchId] = useState('');
  const [state, setState] = useState(true);
  const [comment, setComment] = useState('');
  const [churches, setChurches] = useState<any[]>([]);

  const [getChurches] = useLazyQuery(GET_ALL_CHURCH, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setChurches((data as any)?.Church?.getAll || []);
    },
  });

  const [getBank, { data, loading: loadingBank }] = useLazyQuery(GET_ALL_BANK, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (id) {
      getChurches();
      getBank({
        variables: {}
      });
    }
  }, [id, getBank, getChurches]);

  useEffect(() => {
    if (data) {
      const banks = (data as any)?.Bank?.getAll || [];
      const bank = banks.find((b: any) => b.id === id);
      if (bank) {
        setAmount(bank.amount?.toString() || '');
        setDate(bank.date || new Date().toISOString().split('T')[0]);
        setType(bank.type || '');
        setChurchId(bank.churchId?.toString() || '');
        setState(bank.state !== undefined ? bank.state : true);
        setComment(bank.comment || '');
      }
    }
  }, [data, id]);

  const [updateBank, { loading }] = useMutation(UPDATE_BANK, {
    onCompleted: (data) => {
      const response = data?.Bank?.update;
      if (response?.code === 200) {
        toast.success(response.message || 'Movimiento actualizado exitosamente');
        router.push('/inventory');
      } else {
        toast.error(response?.message || 'Error al actualizar el movimiento');
      }
    },
    onError: (error) => {
      toast.error('Error al actualizar el movimiento: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !date || !churchId) {
      toast.error('Los campos monto, fecha e iglesia son requeridos');
      return;
    }

    await updateBank({
      variables: {
        id,
        bank: {
          amount: parseInt(amount),
          date: date,
          type: type || null,
          churchId: churchId,
          state: state,
          comment: comment || '',
        }
      },
    });
  };

  if (loadingBank) {
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
              <CardTitle>Editar Movimiento Bancario</CardTitle>
              <CardDescription>
                Modifique los datos del movimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Monto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Input
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="Tipo de movimiento"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="churchId">Iglesia *</Label>
                    <Select value={churchId} onValueChange={setChurchId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una iglesia" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Comentario</Label>
                  <Input
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comentario o descripción"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="state"
                    checked={state}
                    onCheckedChange={(checked) => setState(checked === true)}
                  />
                  <Label htmlFor="state" className="cursor-pointer">
                    Activo
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Movimiento'}
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
