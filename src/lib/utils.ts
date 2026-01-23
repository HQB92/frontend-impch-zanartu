import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convierte un texto a Title Case (primera letra de cada palabra en mayúscula)
 * @param str - Texto a convertir
 * @returns Texto en Title Case
 * @example
 * toTitleCase("hugo esteban quinteros bustos") // "Hugo Esteban Quinteros Bustos"
 */
export function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
