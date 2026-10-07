'use client';

import { useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CREATE_MERRIAGE } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MerriageForm, type MerriageRecordInput } from "@/components/merriage-form"

export default function RegisterMerriagePage() {
  const router = useRouter();
  const [createMerriage, { data, loading, error }] = useMutation(CREATE_MERRIAGE);

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    try {
      await createMerriage({
        variables: {
          merriageRecord
        }
      });
    } catch (err) {
      console.error('Error creating marriage:', err);
    }
  };

  useEffect(() => {
    if (data) {
      const response = (data as any)?.MerriageRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Matrimonio registrado exitosamente');
        setTimeout(() => {
          router.push('/merriage');
          // Forzar recarga de la página de listado
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Matrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Error al registrar matrimonio: {error.message}
              </AlertDescription>
            </Alert>
          )}
          <MerriageForm
            submitting={loading}
            submitLabel="Registrar Matrimonio"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
