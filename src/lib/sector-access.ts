// Reglas de acceso por rol. Sin imports: los tests lo ejecutan con Node.

export const ADMIN_ROLE = 'Administrador';
export const SECTOR_ROLE = 'PastorSector';

const hasRole = (roles: unknown, role: string): boolean =>
  Array.isArray(roles) && roles.includes(role);

export function isSectorAccount(roles: unknown): boolean {
  return hasRole(roles, SECTOR_ROLE);
}

// Si un usuario tuviera ambos roles se le trata como pastor, igual que en el backend.
export function isAdminAccount(roles: unknown): boolean {
  return hasRole(roles, ADMIN_ROLE) && !isSectorAccount(roles);
}

const isUnder = (pathname: string, base: string): boolean =>
  pathname === base || pathname.startsWith(`${base}/`);

export function isSectorPath(pathname: string): boolean {
  return isUnder(pathname, '/sector');
}

const SECTOR_ACCOUNT_PATHS = ['/', '/login', '/dashboard'];

// Un registro siempre nace desde la cuenta de la iglesia, y el perfil es suyo.
const PASTOR_ONLY_PATHS = ['/sector/profile', '/sector/baptism/register', '/sector/merriage/register'];

export function canAccessPath(roles: unknown, pathname: string): boolean {
  if (isSectorAccount(roles)) {
    return SECTOR_ACCOUNT_PATHS.includes(pathname) || isSectorPath(pathname);
  }
  if (isSectorPath(pathname)) {
    return isAdminAccount(roles) && !PASTOR_ONLY_PATHS.includes(pathname);
  }
  return true;
}

// Ruta del perfil propio: las cuentas de sector no pueden abrir /account.
export function profilePathFor(roles: unknown): string {
  return isSectorAccount(roles) ? '/sector/profile' : '/account';
}
