'use client';

import { useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CREATE_BAPTISM } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BaptismForm, type BaptismFormValues } from "@/components/baptism-form"

export default function RegisterBaptismPage() {
  const router = useRouter();
  const [createBaptism, { data, loading, error }] = useMutation(CREATE_BAPTISM);

  useEffect(() => {
    if (data) {
      const response = (data as any)?.BaptismRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Bautizo registrado exitosamente');
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
      console.error('Error creating baptism:', err);
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Bautizo</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Error al registrar bautizo: {error.message}
              </AlertDescription>
            </Alert>
          )}
          <BaptismForm
            submitting={loading}
            submitLabel="Registrar Bautizo"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
