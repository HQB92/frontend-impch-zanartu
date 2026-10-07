'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MerriageForm, type MerriageRecordInput } from "@/components/merriage-form"
import { CREATE_SECTOR_MERRIAGE, type ServiceResult, typedDoc } from "@/services/sector-graphql"

interface CreateData {
  SectorMerriageRecord: { create: ServiceResult | null } | null;
}

export default function RegisterSectorMerriagePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  // Tras guardar se navega al listado; hasta entonces no se puede reenviar.
  const [done, setDone] = useState(false);
  const [createMerriage, { loading }] = useMutation(typedDoc<CreateData>(CREATE_SECTOR_MERRIAGE));

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    setErrorMessage('');
    try {
      const response = await createMerriage({ variables: { merriageRecord } });
      const result = response.data?.SectorMerriageRecord?.create;
      if (result?.code === 201) {
        setDone(true);
        toast.success(result.message || 'Matrimonio registrado exitosamente');
        router.push('/sector/merriage');
      } else {
        setErrorMessage(result?.message || 'No se pudo registrar el matrimonio');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo registrar el matrimonio');
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Matrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <MerriageForm
            submitting={loading || done}
            submitLabel="Registrar Matrimonio"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/merriage')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
