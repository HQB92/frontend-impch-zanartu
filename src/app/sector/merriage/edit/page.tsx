'use client';

import { Suspense, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/loader"
import { MerriageForm, toMerriageFormValues, type MerriageRecordInput } from "@/components/merriage-form"
import {
  GET_SECTOR_MERRIAGE_BY_ID,
  UPDATE_SECTOR_MERRIAGE,
  type SectorMerriage,
  type ServiceResult,
  typedDoc,
} from "@/services/sector-graphql"

interface ByIdData {
  SectorMerriageRecord: { getById: SectorMerriage | null } | null;
}

interface UpdateData {
  SectorMerriageRecord: { update: ServiceResult | null } | null;
}

function EditSectorMerriage() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const [errorMessage, setErrorMessage] = useState('');

  const [getMerriage, { data, loading: queryLoading, called }] = useLazyQuery(typedDoc<ByIdData>(GET_SECTOR_MERRIAGE_BY_ID), {
    fetchPolicy: 'no-cache',
  });
  const [updateMerriage, { loading }] = useMutation(typedDoc<UpdateData>(UPDATE_SECTOR_MERRIAGE));

  useEffect(() => {
    if (id) getMerriage({ variables: { id } });
  }, [id, getMerriage]);

  const record = data?.SectorMerriageRecord?.getById ?? null;

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    setErrorMessage('');
    try {
      const response = await updateMerriage({ variables: { id, merriageRecord } });
      const result = response.data?.SectorMerriageRecord?.update;
      if (result?.code === 200) {
        toast.success(result.message || 'Matrimonio actualizado exitosamente');
        router.push('/sector/merriage');
      } else {
        setErrorMessage(result?.message || 'No se pudo actualizar el matrimonio');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo actualizar el matrimonio');
    }
  };

  if (id && (!called || queryLoading)) return (
    <PageShell>
      <Loader />
    </PageShell>
  );

  if (!id || !record) {
    return (
      <PageShell>
        <Card>
          <CardContent>
            <p className="text-destructive">Registro no encontrado</p>
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
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <MerriageForm
            initialValues={toMerriageFormValues(record)}
            submitting={loading}
            submitLabel="Actualizar Matrimonio"
            submittingLabel="Actualizando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/merriage')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default function EditSectorMerriagePage() {
  return (
    <Suspense fallback={
      <PageShell>
        <Loader />
      </PageShell>
    }>
      <EditSectorMerriage />
    </Suspense>
  );
}
