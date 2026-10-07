'use client';

import { useState, useEffect, Suspense } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/loader"
import { GET_BAPTISM_BY_CHILD_RUT } from "@/services/query"
import { CREATE_BAPTISM } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BaptismForm, toBaptismFormValues, type BaptismFormValues } from "@/components/baptism-form"

function EditBaptismForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childRUT = searchParams.get('childRUT');

  const [initialValues, setInitialValues] = useState<BaptismFormValues | null>(null);

  const [getBaptism, { data: queryData, loading: queryLoading }] = useLazyQuery(GET_BAPTISM_BY_CHILD_RUT, {
    fetchPolicy: 'no-cache',
  });

  const [createBaptism, { data, loading, error }] = useMutation(CREATE_BAPTISM);

  useEffect(() => {
    if (childRUT) {
      getBaptism({ variables: { childRUT } });
    }
  }, [childRUT, getBaptism]);

  useEffect(() => {
    if (queryData) {
      const baptismData = (queryData as any)?.BaptismRecord?.getByChildRut;
      if (baptismData) {
        setInitialValues(toBaptismFormValues(baptismData));
      }
    }
  }, [queryData]);

  useEffect(() => {
    if (data) {
      const response = (data as any)?.BaptismRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Bautizo actualizado exitosamente');
        setTimeout(() => {
          router.push('/baptism');
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  const handleSubmit = async (baptism: BaptismFormValues) => {
    try {
      await createBaptism({
        variables: { baptismRecord: baptism }
      });
    } catch (err) {
      console.error('Error updating baptism:', err);
    }
  };

  if (queryLoading) return (
    <PageShell>
      <Loader />
    </PageShell>
  );

  if (!childRUT) {
    return (
      <PageShell>
        <Card>
          <CardContent>
            <p className="text-destructive">No se proporcionó el RUT del niño</p>
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Error al actualizar bautizo: {error.message}
              </AlertDescription>
            </Alert>
          )}
          {/* La key vuelve a montar el formulario cuando llegan los datos. */}
          <BaptismForm
            key={initialValues ? 'cargado' : 'vacio'}
            initialValues={initialValues ?? undefined}
            submitting={loading}
            submitLabel="Actualizar Bautizo"
            submittingLabel="Actualizando..."
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}

export default function EditBaptismPage() {
  return (
    <Suspense fallback={
      <PageShell>
        <Loader />
      </PageShell>
    }>
      <EditBaptismForm />
    </Suspense>
  );
}
