'use client';

import { Suspense, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from "@/components/loader"
import { BaptismForm, toBaptismFormValues, type BaptismFormValues } from "@/components/baptism-form"
import {
  GET_SECTOR_BAPTISM_BY_ID,
  UPDATE_SECTOR_BAPTISM,
  type SectorBaptism,
  type ServiceResult,
  typedDoc,
} from "@/services/sector-graphql"

interface ByIdData {
  SectorBaptismRecord: { getById: SectorBaptism | null } | null;
}

interface UpdateData {
  SectorBaptismRecord: { update: ServiceResult | null } | null;
}

function EditSectorBaptism() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const [errorMessage, setErrorMessage] = useState('');

  const [getBaptism, { data, loading: queryLoading, called }] = useLazyQuery(typedDoc<ByIdData>(GET_SECTOR_BAPTISM_BY_ID), {
    fetchPolicy: 'no-cache',
  });
  const [updateBaptism, { loading }] = useMutation(typedDoc<UpdateData>(UPDATE_SECTOR_BAPTISM));

  useEffect(() => {
    if (id) getBaptism({ variables: { id } });
  }, [id, getBaptism]);

  const record = data?.SectorBaptismRecord?.getById ?? null;

  const handleSubmit = async (baptism: BaptismFormValues) => {
    setErrorMessage('');
    try {
      const response = await updateBaptism({ variables: { id, baptismRecord: baptism } });
      const result = response.data?.SectorBaptismRecord?.update;
      if (result?.code === 200) {
        toast.success(result.message || 'Bautizo actualizado exitosamente');
        router.push('/sector/baptism');
      } else {
        setErrorMessage(result?.message || 'No se pudo actualizar el bautizo');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo actualizar el bautizo');
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
          <CardTitle>Editar Bautizo</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <BaptismForm
            strict
            initialValues={toBaptismFormValues(record)}
            submitting={loading}
            submitLabel="Actualizar Bautizo"
            submittingLabel="Actualizando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/baptism')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default function EditSectorBaptismPage() {
  return (
    <Suspense fallback={
      <PageShell>
        <Loader />
      </PageShell>
    }>
      <EditSectorBaptism />
    </Suspense>
  );
}
