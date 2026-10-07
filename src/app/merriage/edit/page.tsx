'use client';

import { useState, useEffect, Suspense } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/loader"
import { GET_ALL_MERRIAGE } from "@/services/query"
import { UPDATE_MERRIAGE } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MerriageForm,
  toMerriageFormValues,
  type MerriageFormValues,
  type MerriageRecordInput,
} from "@/components/merriage-form"

function EditMerriageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const marriageId = searchParams.get('id');

  const [initialValues, setInitialValues] = useState<MerriageFormValues | null>(null);

  const [getMarriages, { data: queryData, loading: queryLoading }] = useLazyQuery(GET_ALL_MERRIAGE, {
    fetchPolicy: 'no-cache',
  });

  const [updateMerriage, { data, loading, error }] = useMutation(UPDATE_MERRIAGE);

  useEffect(() => {
    getMarriages();
  }, [getMarriages]);

  useEffect(() => {
    if (queryData && marriageId) {
      const marriages = (queryData as any)?.MerriageRecord?.getAll || [];
      const marriageData = marriages.find((m: any) => m.id === marriageId);
      if (marriageData) {
        setInitialValues(toMerriageFormValues(marriageData));
      }
    }
  }, [queryData, marriageId]);

  useEffect(() => {
    if (data) {
      const response = (data as any)?.MerriageRecord?.update;
      if (response?.code === 200) {
        toast.success(response.message || 'Matrimonio actualizado exitosamente');
        setTimeout(() => {
          router.push('/merriage');
          // Forzar recarga de la página de listado
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    try {
      await updateMerriage({
        variables: {
          id: marriageId,
          merriageRecord
        }
      });
    } catch (err) {
      console.error('Error updating marriage:', err);
    }
  };

  if (queryLoading) return (
    <PageShell>
      <Loader />
    </PageShell>
  );

  if (!marriageId) {
    return (
      <PageShell>
        <Card>
          <CardContent>
            <p className="text-destructive">No se proporcionó el ID del matrimonio</p>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Editar Matrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Error al actualizar matrimonio: {error.message}
              </AlertDescription>
            </Alert>
          )}
          {/* La key vuelve a montar el formulario cuando llegan los datos. */}
          <MerriageForm
            key={initialValues ? 'cargado' : 'vacio'}
            initialValues={initialValues ?? undefined}
            submitting={loading}
            submitLabel="Actualizar Matrimonio"
            submittingLabel="Actualizando..."
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default function EditMerriagePage() {
  return (
    <Suspense fallback={
      <PageShell>
        <Loader />
      </PageShell>
    }>
      <EditMerriageForm />
    </Suspense>
  );
}
