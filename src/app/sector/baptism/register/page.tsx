'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BaptismForm, type BaptismFormValues } from "@/components/baptism-form"
import { CREATE_SECTOR_BAPTISM, type ServiceResult, typedDoc } from "@/services/sector-graphql"

interface CreateData {
  SectorBaptismRecord: { create: ServiceResult | null } | null;
}

export default function RegisterSectorBaptismPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [createBaptism, { loading }] = useMutation(typedDoc<CreateData>(CREATE_SECTOR_BAPTISM));

  const handleSubmit = async (baptism: BaptismFormValues) => {
    setErrorMessage('');
    try {
      const response = await createBaptism({ variables: { baptismRecord: baptism } });
      const result = response.data?.SectorBaptismRecord?.create;
      if (result?.code === 201) {
        toast.success(result.message || 'Bautizo registrado exitosamente');
        router.push('/sector/baptism');
      } else {
        setErrorMessage(result?.message || 'No se pudo registrar el bautizo');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo registrar el bautizo');
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Bautizo</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <BaptismForm
            strict
            submitting={loading}
            submitLabel="Registrar Bautizo"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/baptism')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
