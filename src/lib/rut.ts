import Rut from 'rutjs';

export function isValidRut(value: string): boolean {
  if (!value) return false;
  try {
    return new Rut(value).isValid;
  } catch {
    return false;
  }
}

// Formatea mientras se escribe: quita puntos y espacios, y cuando el RUT ya
// tiene guion u ocho caracteres lo deja como 12.345.678-9.
export function formatRutInput(value: string): string {
  const clean = value.replace(/\./g, '').replace(/\s/g, '').toUpperCase();
  if (clean.length === 0) return '';
  if (!clean.includes('-') && clean.length < 8) return clean;
  try {
    return new Rut(clean).getNiceRut();
  } catch {
    return clean;
  }
}
