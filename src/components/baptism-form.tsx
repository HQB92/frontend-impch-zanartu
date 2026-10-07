'use client';

import { useState } from 'react';
import { toTitleCase } from "@/lib/utils";
import { formatRutInput, isValidRut } from "@/lib/rut";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface BaptismFormValues {
  childRUT: string;
  childFullName: string;
  childDateOfBirth: string;
  fatherRUT: string;
  fatherFullName: string;
  motherRUT: string;
  motherFullName: string;
  placeOfRegistration: string;
  baptismDate: string;
  registrationNumber: string;
  registrationDate: string;
}

type BaptismField = keyof BaptismFormValues;
type RutField = 'childRUT' | 'fatherRUT' | 'motherRUT';
type RutErrors = Partial<Record<RutField, string>>;

const RUT_FIELDS: RutField[] = ['childRUT', 'fatherRUT', 'motherRUT'];
const TITLE_CASE_FIELDS: BaptismField[] = ['childFullName', 'fatherFullName', 'motherFullName', 'placeOfRegistration'];

const isRutField = (name: string): name is RutField => (RUT_FIELDS as string[]).includes(name);

const emptyValues: BaptismFormValues = {
  childRUT: '',
  childFullName: '',
  childDateOfBirth: '',
  fatherRUT: '',
  fatherFullName: '',
  motherRUT: '',
  motherFullName: '',
  placeOfRegistration: '',
  baptismDate: '',
  registrationNumber: '',
  registrationDate: '',
};

// Convierte un registro del servidor en valores del formulario: sin nulos y
// con los RUT formateados.
export function toBaptismFormValues(
  record: Partial<Record<BaptismField, string | null>>
): BaptismFormValues {
  const values = { ...emptyValues };
  for (const key of Object.keys(emptyValues) as BaptismField[]) {
    const value = record[key] ?? '';
    values[key] = isRutField(key) && value ? formatRutInput(value) : value;
  }
  return values;
}

interface BaptismFormProps {
  initialValues?: BaptismFormValues;
  strict?: boolean;
  submitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: BaptismFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function BaptismForm({
  initialValues,
  strict = false,
  submitting,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
}: BaptismFormProps) {
  const [baptism, setBaptism] = useState<BaptismFormValues>(initialValues ?? emptyValues);
  const [rutErrors, setRutErrors] = useState<RutErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as BaptismField;
    let newValue = e.target.value;

    if (TITLE_CASE_FIELDS.includes(name)) {
      newValue = toTitleCase(newValue);
    } else if (name === 'registrationNumber') {
      newValue = newValue.replace(/[^0-9]/g, '');
    } else if (isRutField(name)) {
      newValue = formatRutInput(newValue);
      // Solo se marca error cuando el RUT ya está completo (tiene guion).
      const invalid = newValue.includes('-') && !isValidRut(newValue);
      setRutErrors((prev) => ({ ...prev, [name]: invalid ? 'RUT inválido' : undefined }));
    }

    setBaptism((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar RUTs antes de enviar (solo si tienen valor)
    const errors: RutErrors = {};
    for (const field of RUT_FIELDS) {
      if (baptism[field] && !isValidRut(baptism[field])) errors[field] = 'RUT inválido';
    }
    if (Object.keys(errors).length > 0) {
      setRutErrors(errors);
      alert('Por favor, ingresa RUTs válidos.');
      return;
    }

    await onSubmit(baptism);
  };

  const mark = strict ? ' *' : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="childRUT">RUT Niño *</Label>
          <Input
            id="childRUT"
            name="childRUT"
            value={baptism.childRUT}
            onChange={handleChange}
            required
            placeholder="12345678-9"
            className={rutErrors.childRUT ? "border-destructive" : ""}
          />
          {rutErrors.childRUT && (
            <p className="text-sm text-destructive">{rutErrors.childRUT}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="childFullName">Nombre Completo del Niño *</Label>
          <Input
            id="childFullName"
            name="childFullName"
            value={baptism.childFullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="childDateOfBirth">Fecha de Nacimiento del Niño *</Label>
          <Input
            id="childDateOfBirth"
            name="childDateOfBirth"
            type="date"
            value={baptism.childDateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fatherRUT">RUT Padre</Label>
          <Input
            id="fatherRUT"
            name="fatherRUT"
            value={baptism.fatherRUT}
            onChange={handleChange}
            placeholder="12345678-9"
            className={rutErrors.fatherRUT ? "border-destructive" : ""}
          />
          {rutErrors.fatherRUT && (
            <p className="text-sm text-destructive">{rutErrors.fatherRUT}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fatherFullName">Nombre Completo del Padre</Label>
          <Input
            id="fatherFullName"
            name="fatherFullName"
            value={baptism.fatherFullName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="motherRUT">RUT Madre{mark}</Label>
          <Input
            id="motherRUT"
            name="motherRUT"
            value={baptism.motherRUT}
            onChange={handleChange}
            required={strict}
            placeholder="12345678-9"
            className={rutErrors.motherRUT ? "border-destructive" : ""}
          />
          {rutErrors.motherRUT && (
            <p className="text-sm text-destructive">{rutErrors.motherRUT}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="motherFullName">Nombre Completo de la Madre{mark}</Label>
          <Input
            id="motherFullName"
            name="motherFullName"
            value={baptism.motherFullName}
            onChange={handleChange}
            required={strict}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baptismDate">Fecha de Bautismo *</Label>
          <Input
            id="baptismDate"
            name="baptismDate"
            type="date"
            value={baptism.baptismDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="placeOfRegistration">Lugar de Registro{mark}</Label>
          <Input
            id="placeOfRegistration"
            name="placeOfRegistration"
            value={baptism.placeOfRegistration}
            onChange={handleChange}
            required={strict}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationNumber">Número de Registro{mark}</Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={baptism.registrationNumber}
            onChange={handleChange}
            required={strict}
            placeholder="Solo números"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationDate">Fecha de Registro{mark}</Label>
          <Input
            id="registrationDate"
            name="registrationDate"
            type="date"
            value={baptism.registrationDate}
            onChange={handleChange}
            required={strict}
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
