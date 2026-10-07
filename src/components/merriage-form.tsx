'use client';

import { useState } from 'react';
import { toTitleCase } from "@/lib/utils";
import { formatRutInput, isValidRut } from "@/lib/rut";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface MerriageFormValues {
  husbandId: string;
  fullNameHusband: string;
  wifeId: string;
  fullNameWife: string;
  civilCode: string;
  civilDate: string;
  civilPlace: string;
  religiousDate: string;
}

export interface MerriageRecordInput {
  husbandId: string;
  fullNameHusband: string;
  wifeId: string;
  fullNameWife: string;
  civilCode: number;
  civilDate: string;
  civilPlace: string;
  religiousDate: string;
}

interface MerriageSource {
  husbandId?: string | null;
  fullNameHusband?: string | null;
  wifeId?: string | null;
  fullNameWife?: string | null;
  civilCode?: number | string | null;
  civilDate?: string | null;
  civilPlace?: string | null;
  religiousDate?: string | null;
}

type MerriageField = keyof MerriageFormValues;
type RutField = 'husbandId' | 'wifeId';
type RutErrors = Partial<Record<RutField, string>>;

const TITLE_CASE_FIELDS: MerriageField[] = ['fullNameHusband', 'fullNameWife', 'civilPlace'];

const emptyValues: MerriageFormValues = {
  husbandId: '',
  fullNameHusband: '',
  wifeId: '',
  fullNameWife: '',
  civilCode: '',
  civilDate: '',
  civilPlace: '',
  religiousDate: '',
};

// Convierte un registro del servidor en valores del formulario: sin nulos y
// con los RUT formateados.
export function toMerriageFormValues(record: MerriageSource): MerriageFormValues {
  return {
    husbandId: record.husbandId ? formatRutInput(record.husbandId) : '',
    fullNameHusband: record.fullNameHusband ?? '',
    wifeId: record.wifeId ? formatRutInput(record.wifeId) : '',
    fullNameWife: record.fullNameWife ?? '',
    civilCode: record.civilCode != null ? String(record.civilCode) : '',
    civilDate: record.civilDate ?? '',
    civilPlace: record.civilPlace ?? '',
    religiousDate: record.religiousDate ?? '',
  };
}

interface MerriageFormProps {
  initialValues?: MerriageFormValues;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (record: MerriageRecordInput) => void | Promise<void>;
  onCancel: () => void;
}

export function MerriageForm({
  initialValues,
  submitting,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: MerriageFormProps) {
  const [merriage, setMerriage] = useState<MerriageFormValues>(initialValues ?? emptyValues);
  const [rutErrors, setRutErrors] = useState<RutErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as MerriageField;
    let newValue = e.target.value;

    if (TITLE_CASE_FIELDS.includes(name)) {
      newValue = toTitleCase(newValue);
    } else if (name === 'civilCode') {
      newValue = newValue.replace(/[^0-9]/g, '');
    } else if (name === 'husbandId' || name === 'wifeId') {
      newValue = formatRutInput(newValue);
      // Solo se marca error cuando el RUT ya está completo (tiene guion).
      const invalid = newValue.includes('-') && !isValidRut(newValue);
      setRutErrors((prev) => ({ ...prev, [name]: invalid ? 'RUT inválido' : undefined }));
    }

    setMerriage((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar RUTs antes de enviar: ambos son obligatorios
    const husbandRutValid = isValidRut(merriage.husbandId);
    const wifeRutValid = isValidRut(merriage.wifeId);

    if (!husbandRutValid || !wifeRutValid) {
      setRutErrors({
        husbandId: husbandRutValid ? undefined : 'RUT inválido',
        wifeId: wifeRutValid ? undefined : 'RUT inválido',
      });
      alert('Por favor, ingresa RUTs válidos.');
      return;
    }

    const record: MerriageRecordInput = {
      husbandId: merriage.husbandId.trim(),
      fullNameHusband: merriage.fullNameHusband.trim(),
      wifeId: merriage.wifeId.trim(),
      fullNameWife: merriage.fullNameWife.trim(),
      civilCode: parseInt(merriage.civilCode, 10),
      civilDate: merriage.civilDate,
      civilPlace: merriage.civilPlace.trim(),
      religiousDate: merriage.religiousDate,
    };

    // Validar que todos los campos requeridos tengan valores
    if (!record.husbandId || !record.fullNameHusband || !record.wifeId ||
        !record.fullNameWife || !merriage.civilCode || Number.isNaN(record.civilCode) ||
        !record.civilDate || !record.civilPlace || !record.religiousDate) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    await onSubmit(record);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="husbandId">RUT Esposo *</Label>
          <Input
            id="husbandId"
            name="husbandId"
            value={merriage.husbandId}
            onChange={handleChange}
            required
            placeholder="12345678-9"
            className={rutErrors.husbandId ? "border-destructive" : ""}
          />
          {rutErrors.husbandId && (
            <p className="text-sm text-destructive">{rutErrors.husbandId}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullNameHusband">Nombre Completo del Esposo *</Label>
          <Input
            id="fullNameHusband"
            name="fullNameHusband"
            value={merriage.fullNameHusband}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wifeId">RUT Esposa *</Label>
          <Input
            id="wifeId"
            name="wifeId"
            value={merriage.wifeId}
            onChange={handleChange}
            required
            placeholder="12345678-9"
            className={rutErrors.wifeId ? "border-destructive" : ""}
          />
          {rutErrors.wifeId && (
            <p className="text-sm text-destructive">{rutErrors.wifeId}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullNameWife">Nombre Completo de la Esposa *</Label>
          <Input
            id="fullNameWife"
            name="fullNameWife"
            value={merriage.fullNameWife}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="civilCode">Número de Registro *</Label>
          <Input
            id="civilCode"
            name="civilCode"
            type="number"
            value={merriage.civilCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="civilPlace">Lugar de Registro *</Label>
          <Input
            id="civilPlace"
            name="civilPlace"
            value={merriage.civilPlace}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="civilDate">Fecha de Matrimonio Civil *</Label>
          <Input
            id="civilDate"
            name="civilDate"
            type="date"
            value={merriage.civilDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="religiousDate">Fecha de Matrimonio Religioso *</Label>
          <Input
            id="religiousDate"
            name="religiousDate"
            type="date"
            value={merriage.religiousDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? submittingLabel : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
