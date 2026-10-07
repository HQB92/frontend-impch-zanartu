# Acceso de pastores del sector — Plan de implementación (frontend)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que un pastor del sector entre eligiendo su iglesia y su clave, y vea solo un dashboard con sus bautizos y matrimonios, sus certificados y su perfil.

**Architecture:** El login gana una pestaña "Iglesia" que llama a un endpoint propio y guarda un token con rol `PastorSector`. Las reglas de qué ruta puede ver cada rol viven en un módulo puro (`sector-access`) que usan el menú y un guard de rutas. Las pantallas nuevas están bajo `/sector/*` y reutilizan los formularios de bautizo y matrimonio, que se extraen de las páginas actuales a componentes compartidos.

**Tech Stack:** Next.js 16 (App Router), React 19, Apollo Client 4, Tailwind 4, componentes shadcn en `src/components/ui`, jsPDF, rutjs, `node:test` con el soporte nativo de TypeScript de Node 24.

**Spec:** `../docs/superpowers/specs/2026-10-07-acceso-pastores-sector-design.md` (ruta absoluta: `/Users/hquinteb/Desarrollo/Personal/Zañartu/docs/superpowers/specs/2026-10-07-acceso-pastores-sector-design.md`). Léela antes de empezar.

**Plan hermano:** `backend-graphql-impch/docs/superpowers/plans/2026-10-07-acceso-pastores-sector-backend.md`. **El backend debe estar terminado antes de la Task 2**: este plan consume sus endpoints y su esquema GraphQL.

## Global Constraints

- No se agregan dependencias. Los tests usan `node:test`.
- El rol de las cuentas de sector es exactamente `PastorSector`; el de administrador, `Administrador`.
- Rutas nuevas, exactamente: `/sector/baptism`, `/sector/baptism/register`, `/sector/baptism/edit`, `/sector/merriage`, `/sector/merriage/register`, `/sector/merriage/edit`, `/sector/profile`.
- Una cuenta de sector solo puede ver `/`, `/login`, `/dashboard` y `/sector/*`.
- Las pantallas de Zañartu (`/baptism`, `/merriage` y sus subrutas) deben verse y comportarse igual que antes. Sus consultas y mutaciones no cambian.
- El certificado PDF es el mismo: no se modifica nada en `src/lib/certificates/`.
- Los nombres de las variables GraphQL deben coincidir con los nombres de los argumentos (`id`, `baptismRecord`, `merriageRecord`, `sectorChurchId`, `pastor`, `address`, `phone`, `currentPassword`, `newPassword`): el backend los lee por ese nombre.
- Código nuevo sin `any`. Los archivos existentes que se modifican conservan su estilo.
- Textos de interfaz en español, con tildes.
- La clave nueva tiene un mínimo de 8 caracteres.
- Rama de trabajo: `feature/acceso-pastores-sector`. No se hace push ni merge a `main` sin que el usuario lo pida.

## Review Focus

1. **Un pastor escribe a mano una ruta que no le corresponde** (`/bank`, `/members/edit/1-9`, `/sectores`): debe volver a `/dashboard`. Test en Task 1.
2. **El nombre de la iglesia tiene tilde o ñ** ("San Fabián", "San Nicolás"): el token trae UTF-8 en base64url y el `atob` actual lo rompe o lanza error, lo que cerraría la sesión al recargar. Debe mostrarse bien y la sesión debe sobrevivir a una recarga. Test en Task 2.
3. **Un usuario de Zañartu que no es administrador entra a `/sector/*`**, o el administrador entra a `/sector/profile` o a un `/register`: deben volver a `/dashboard`. Test en Task 1.
4. **Un RUT escrito sin puntos, con `k` minúscula o con basura:** se formatea igual y uno inválido se rechaza antes de enviar. Test en Task 5.
5. **Una sesión guardada con `roles` ausente o con forma inesperada** (sesión antigua en `localStorage`): no debe romper la página ni dar acceso de sector. Test en Task 1.

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `src/lib/sector-access.ts` | Reglas puras: roles y qué ruta puede ver cada uno |
| `src/lib/jwt.ts` | Decodificar el payload de un JWT (base64url + UTF-8) |
| `src/lib/rut.ts` | Formatear y validar RUT |
| `src/services/sector-login.ts` | Lista pública de iglesias y login de iglesia |
| `src/services/sector-graphql.ts` | Tipos y documentos GraphQL de sector |
| `src/contexts/auth-context.tsx` (modificar) | `signInSector`, decodificación correcta del token |
| `src/hooks/use-roles.ts` (modificar) | `useIsSector` |
| `src/components/login-form.tsx` (modificar) | Pestañas Usuario / Iglesia |
| `src/config/sidebar-config.tsx` (modificar) | Ítems de sector |
| `src/components/sector-route-guard.tsx` | Redirige si la ruta no corresponde al rol |
| `src/app/layout.tsx` (modificar) | Monta el guard |
| `src/components/page-shell.tsx` | Marco de página (sidebar + header) |
| `src/components/baptism-form.tsx` | Formulario de bautizo compartido |
| `src/components/merriage-form.tsx` | Formulario de matrimonio compartido |
| `src/app/baptism/register/page.tsx`, `src/app/baptism/edit/page.tsx`, `src/app/merriage/register/page.tsx`, `src/app/merriage/edit/page.tsx` (modificar) | Usan los formularios compartidos |
| `src/components/sector/confirm-delete-dialog.tsx` | Diálogo de confirmación de borrado |
| `src/components/sector/sector-church-filter.tsx` | Filtro por iglesia (solo administrador) |
| `src/app/sector/baptism/**`, `src/app/sector/merriage/**` | Listado, registro y edición |
| `src/app/sector/profile/page.tsx` | Perfil y cambio de clave |
| `src/components/sector-dashboard.tsx` | Dashboard de sector |
| `src/app/dashboard/page.tsx` (modificar) | Elige el dashboard según el rol |

Los documentos GraphQL de sector van en un solo archivo (`sector-graphql.ts`) en vez de un archivo por operación más un índice, como el resto: son quince operaciones que siempre cambian juntas y comparten tipos.

---

### Task 0: Preparación

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Create: `.env.local` (local, ya cubierto por `.env*` en `.gitignore`)

- [ ] **Step 1: Crear la rama e instalar**

```bash
cd /Users/hquinteb/Desarrollo/Personal/Zañartu/frontend-impch-zanartu
git checkout -b feature/acceso-pastores-sector
pnpm install
```

Expected: termina sin errores y existe `node_modules/`.

- [ ] **Step 2: Crear `.env.local` si no existe**

Si ya existe, no lo toques. Si no:

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_URL=http://localhost:4000
EOF
```

- [ ] **Step 3: Script de test**

En `package.json`, dentro de `"scripts"`, después de `"lint": "eslint"`:

```json
    "lint": "eslint",
    "test": "node --test \"src/**/*.test.ts\""
```

- [ ] **Step 4: Permitir imports con extensión `.ts`**

Los tests corren con el soporte nativo de TypeScript de Node, que exige la extensión en los imports relativos. En `tsconfig.json`, dentro de `compilerOptions`, después de `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 5: Registrar la línea base**

```bash
pnpm lint 2>&1 | tail -5
pnpm build 2>&1 | tail -20
```

Anota cuántos errores y avisos reporta `pnpm lint` antes de tus cambios (el código existente usa `any` y puede traer errores previos). `pnpm build` debe terminar bien; si falla antes de tus cambios, detente y repórtalo.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json
git commit -m "chore: script de test y soporte de imports .ts para tests"
```

---

### Task 1: Reglas de acceso por rol

**Files:**
- Create: `src/lib/sector-access.ts`
- Test: `src/lib/sector-access.test.ts`

**Interfaces:**
- Consumes: nada. Este archivo no debe importar nada: lo ejecuta Node directamente en los tests.
- Produces:
  - `ADMIN_ROLE: 'Administrador'`, `SECTOR_ROLE: 'PastorSector'`
  - `isSectorAccount(roles: unknown): boolean`
  - `isAdminAccount(roles: unknown): boolean`
  - `isSectorPath(pathname: string): boolean`
  - `canAccessPath(roles: unknown, pathname: string): boolean`

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/sector-access.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPath, isAdminAccount, isSectorAccount, isSectorPath } from './sector-access.ts';

const pastor = ['PastorSector'];
const admin = ['Administrador'];
const secretario = ['Secretario'];

test('un pastor de sector solo ve el dashboard y /sector', () => {
  for (const path of ['/', '/login', '/dashboard', '/sector/baptism', '/sector/baptism/register',
    '/sector/baptism/edit', '/sector/merriage', '/sector/merriage/register', '/sector/profile']) {
    assert.equal(canAccessPath(pastor, path), true, path);
  }
});

test('un pastor de sector no ve las rutas de Zañartu aunque las escriba a mano', () => {
  for (const path of ['/bank', '/offering', '/expenses', '/members', '/members/edit/1-9', '/customers',
    '/churchs', '/baptism', '/baptism/register', '/merriage', '/inventory', '/rehearsals', '/account',
    '/dashboard/otra']) {
    assert.equal(canAccessPath(pastor, path), false, path);
  }
});

test('una ruta que solo empieza parecido a /sector no cuenta como de sector', () => {
  assert.equal(isSectorPath('/sector'), true);
  assert.equal(isSectorPath('/sector/baptism'), true);
  assert.equal(isSectorPath('/sectores'), false);
  assert.equal(isSectorPath('/sector-x/baptism'), false);
  assert.equal(canAccessPath(pastor, '/sectores'), false);
});

test('el administrador ve los listados y la edición de sector, además de todo lo de Zañartu', () => {
  for (const path of ['/dashboard', '/bank', '/baptism', '/sector/baptism', '/sector/baptism/edit',
    '/sector/merriage', '/sector/merriage/edit']) {
    assert.equal(canAccessPath(admin, path), true, path);
  }
});

test('el administrador no entra al perfil ni a crear registros de sector', () => {
  for (const path of ['/sector/profile', '/sector/baptism/register', '/sector/merriage/register']) {
    assert.equal(canAccessPath(admin, path), false, path);
  }
});

test('otros roles de Zañartu no entran a /sector', () => {
  assert.equal(canAccessPath(secretario, '/sector/baptism'), false);
  assert.equal(canAccessPath(secretario, '/sector/profile'), false);
  assert.equal(canAccessPath(secretario, '/baptism'), true);
  assert.equal(canAccessPath(secretario, '/dashboard'), true);
});

test('roles ausentes o con forma inesperada no rompen ni dan acceso de sector', () => {
  for (const roles of [undefined, null, 'PastorSector', {}, 42, []]) {
    assert.equal(isSectorAccount(roles), false);
    assert.equal(isAdminAccount(roles), false);
    assert.equal(canAccessPath(roles, '/sector/baptism'), false);
    assert.equal(canAccessPath(roles, '/dashboard'), true);
  }
});

test('Administrador y PastorSector a la vez se trata como pastor', () => {
  const ambos = ['Administrador', 'PastorSector'];
  assert.equal(canAccessPath(ambos, '/bank'), false);
  assert.equal(canAccessPath(ambos, '/sector/profile'), true);
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `pnpm test`
Expected: FAIL con `Cannot find module ... sector-access.ts`.

- [ ] **Step 3: Implementar**

Crear `src/lib/sector-access.ts`:

```ts
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
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `pnpm test`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sector-access.ts src/lib/sector-access.test.ts
git commit -m "feat: reglas de acceso por rol para cuentas de sector"
```

---

### Task 2: Sesión de iglesia

**Files:**
- Create: `src/lib/jwt.ts`
- Create: `src/services/sector-login.ts`
- Modify: `src/contexts/auth-context.tsx` (reemplazo completo)
- Modify: `src/hooks/use-roles.ts`
- Test: `src/lib/jwt.test.ts`

**Interfaces:**
- Consumes:
  - `ADMIN_ROLE`, `SECTOR_ROLE`, `isSectorAccount`, `isAdminAccount` de `src/lib/sector-access.ts` (Task 1).
  - Backend: `GET /auth/sector-churches` → `[{ id: number, name: string }]`; `POST /auth/sector-login` con `{ sectorChurchId, password }` → `{ token }` o `401 { message }`.
- Produces:
  - `decodeJwtPayload(token: string): Record<string, unknown> | null` (`src/lib/jwt.ts`)
  - `SectorChurchOption = { id: number; name: string }`, `fetchSectorChurches(): Promise<SectorChurchOption[]>`, `loginSector(sectorChurchId: number, password: string): Promise<string>` (`src/services/sector-login.ts`)
  - `useAuth()` devuelve además `signInSector(sectorChurchId: number, password: string): Promise<void>`; `user` incluye `sectorChurchId?: number | null`.
  - `auth-context` reexporta `ADMIN_ROLE` y `SECTOR_ROLE`.
  - `useIsSector(): boolean`, y `useIsAdmin()` pasa a usar `isAdminAccount` (`src/hooks/use-roles.ts`).

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/jwt.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeJwtPayload } from './jwt.ts';

const encode = (payload: object): string => Buffer.from(JSON.stringify(payload)).toString('base64url');
const tokenOf = (payload: object): string => `cabecera.${encode(payload)}.firma`;

test('decodifica un payload normal', () => {
  const payload = decodeJwtPayload(tokenOf({ userId: 1, username: 'hugo', roles: ['Administrador'], exp: 1790000000 }));

  assert.deepEqual(payload, { userId: 1, username: 'hugo', roles: ['Administrador'], exp: 1790000000 });
});

test('conserva tildes y eñes en el nombre de la iglesia', () => {
  for (const name of ['San Fabián', 'San Nicolás', 'Ñiquén', 'Zañartu']) {
    assert.equal(decodeJwtPayload(tokenOf({ username: name }))?.username, name);
  }
});

test('acepta los caracteres - y _ propios de base64url', () => {
  const candidates = Array.from({ length: 12 }, (_, n) => ({ username: 'San Fabián', relleno: `${' '.repeat(n)}>>>???` }));
  const payload = candidates.find((candidate) => /-/.test(encode(candidate)) && /_/.test(encode(candidate)));

  assert.ok(payload, 'no se encontró un payload de prueba con - y _');
  assert.deepEqual(decodeJwtPayload(tokenOf(payload)), payload);
});

test('un token mal formado devuelve null en vez de lanzar', () => {
  for (const token of ['', 'sin-puntos', 'a.b', 'a.%%%.c', `a.${Buffer.from('no es json').toString('base64url')}.c`,
    `a.${Buffer.from('"texto"').toString('base64url')}.c`, `a.${Buffer.from('null').toString('base64url')}.c`]) {
    assert.equal(decodeJwtPayload(token), null, token);
  }
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `pnpm test`
Expected: FAIL con `Cannot find module ... jwt.ts`.

- [ ] **Step 3: Implementar `src/lib/jwt.ts`**

```ts
// Decodifica el payload de un JWT sin verificar la firma (eso lo hace el backend).
// El payload viene en base64url y en UTF-8; atob solo no alcanza: falla con
// los caracteres - y _ y rompe las tildes. Sin imports: lo ejecutan los tests.
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `pnpm test`
Expected: PASS, 12 tests.

- [ ] **Step 5: Servicio de login de iglesia**

Crear `src/services/sector-login.ts`:

```ts
import axios from 'axios';

export interface SectorChurchOption {
  id: number;
  name: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL || '';
const churchesPath = process.env.NEXT_PUBLIC_PATHSECTORCHURCHES || '/auth/sector-churches';
const loginPath = process.env.NEXT_PUBLIC_PATHSECTORLOGIN || '/auth/sector-login';

const CONNECTION_ERROR = 'Error de conexión con el servidor. Intenta de nuevo en unos minutos.';

export const fetchSectorChurches = async (): Promise<SectorChurchOption[]> => {
  try {
    const response = await axios.get(`${baseUrl}${churchesPath}`, {
      headers: { Accept: 'application/json' },
    });
    return Array.isArray(response.data) ? (response.data as SectorChurchOption[]) : [];
  } catch {
    throw new Error('No se pudo cargar la lista de iglesias. Intenta de nuevo.');
  }
};

export const loginSector = async (sectorChurchId: number, password: string): Promise<string> => {
  let response;
  try {
    response = await axios.post(
      `${baseUrl}${loginPath}`,
      { sectorChurchId, password },
      {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // Un 401 no es un error de red: se lee su mensaje más abajo.
        validateStatus: (status: number) => status < 500,
      }
    );
  } catch {
    throw new Error(CONNECTION_ERROR);
  }

  const token: unknown = response.data?.token;
  if (response.status >= 400 || typeof token !== 'string' || token.length === 0) {
    throw new Error(response.data?.message || 'Credenciales inválidas');
  }
  return token;
};
```

- [ ] **Step 6: Reemplazar `src/contexts/auth-context.tsx` completo**

Cambios respecto al actual: usa `decodeJwtPayload` en vez de `atob` (inicio de sesión y recarga), agrega `signInSector`, guarda `sectorChurchId` y limpia la sesión en un solo lugar.

```tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/login';
import { loginSector } from '@/services/sector-login';
import { decodeJwtPayload } from '@/lib/jwt';

export { ADMIN_ROLE, SECTOR_ROLE } from '@/lib/sector-access';

interface User {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  rut?: string;
  roles?: string[];
  churchId?: number | null;
  sectorChurchId?: number | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
  signInSector: (sectorChurchId: number, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'INITIALIZE'; payload?: User }
  | { type: 'SIGN_IN'; payload: User }
  | { type: 'SIGN_OUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        ...(action.payload
          ? {
              isAuthenticated: true,
              isLoading: false,
              user: action.payload,
            }
          : {
              isLoading: false,
            }),
      };
    case 'SIGN_IN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const clearSession = () => {
  window.localStorage.removeItem('profile');
  window.localStorage.removeItem('authenticated');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  document.cookie = 'auth-session=; path=/; max-age=0';
};

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

// Arma el usuario de la sesión a partir del payload del token. Sirve tanto
// para un usuario de Zañartu como para una cuenta de iglesia del sector.
const userFromPayload = (payload: Record<string, unknown>): User => ({
  id: String(payload.userId ?? payload.id ?? payload.sectorChurchId ?? ''),
  name: asString(payload.username) || asString(payload.name),
  email: asString(payload.email),
  rut: asString(payload.rut) || undefined,
  roles: Array.isArray(payload.roles) ? (payload.roles as string[]) : [],
  churchId: typeof payload.churchId === 'number' ? payload.churchId : null,
  sectorChurchId: typeof payload.sectorChurchId === 'number' ? payload.sectorChurchId : null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initialized = useRef(false);
  const router = useRouter();

  const initialize = () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (typeof window === 'undefined') {
      dispatch({ type: 'INITIALIZE' });
      return;
    }

    let user: User | null = null;

    try {
      const authenticatedFlag = window.localStorage.getItem('authenticated') === 'true';
      const token = window.localStorage.getItem('token');

      if (authenticatedFlag && token) {
        const payload = decodeJwtPayload(token);
        const exp = typeof payload?.exp === 'number' ? payload.exp : null;

        if (!payload || (exp !== null && Date.now() >= exp * 1000)) {
          // Token ilegible o vencido
          clearSession();
        } else {
          const userData = window.localStorage.getItem('user');
          user = userData ? (JSON.parse(userData) as User) : null;
        }
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      user = null;
    }

    dispatch(user ? { type: 'INITIALIZE', payload: user } : { type: 'INITIALIZE' });
  };

  useEffect(() => {
    initialize();
  }, []);

  const startSession = (token: string | null) => {
    if (!token) {
      dispatch({ type: 'SIGN_OUT' });
      throw new Error('Por favor revisa tus credenciales');
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      dispatch({ type: 'SIGN_OUT' });
      throw new Error('Error al procesar la respuesta del servidor');
    }

    const user = userFromPayload(payload);

    window.localStorage.setItem('authenticated', 'true');
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('user', JSON.stringify(user));
    document.cookie = 'auth-session=1; path=/; SameSite=Lax';

    dispatch({ type: 'SIGN_IN', payload: user });

    // Redirigir al dashboard después del login exitoso
    router.push('/dashboard');
  };

  const signIn = async (username: string, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot sign in on server');
    }

    try {
      startSession(await login(username, password));
    } catch (err) {
      // Re-lanzar el error con el mensaje original para que se muestre en el formulario
      dispatch({ type: 'SIGN_OUT' });
      throw err;
    }
  };

  const signInSector = async (sectorChurchId: number, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot sign in on server');
    }

    try {
      startSession(await loginSector(sectorChurchId, password));
    } catch (err) {
      dispatch({ type: 'SIGN_OUT' });
      throw err;
    }
  };

  const signOut = () => {
    if (typeof window !== 'undefined') {
      clearSession();
      window.localStorage.removeItem('ally-supports-cache');
    }

    dispatch({ type: 'SIGN_OUT' });
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signInSector,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

- [ ] **Step 7: Reemplazar `src/hooks/use-roles.ts` completo**

```ts
import { useAuth } from '@/contexts/auth-context';
import { isAdminAccount, isSectorAccount } from '@/lib/sector-access';

export const useRoles = () => {
  const { user } = useAuth();
  return user?.roles || [];
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return isAdminAccount(user?.roles);
};

export const useIsSector = () => {
  const { user } = useAuth();
  return isSectorAccount(user?.roles);
};
```

- [ ] **Step 8: Verificar**

Run: `pnpm test`
Expected: PASS, 12 tests.

Run: `pnpm build`
Expected: termina bien, sin errores de tipos.

Con el backend corriendo (`pnpm dev` en `backend-graphql-impch`) y el frontend en `pnpm dev`, inicia sesión con un usuario de Zañartu existente en `http://localhost:3000/login`.
Expected: entra al dashboard como antes, y al recargar la página sigue con la sesión iniciada.

- [ ] **Step 9: Commit**

```bash
git add src/lib/jwt.ts src/lib/jwt.test.ts src/services/sector-login.ts src/contexts/auth-context.tsx src/hooks/use-roles.ts
git commit -m "feat: sesión de iglesia del sector y decodificación correcta del token"
```

---

### Task 3: Pestaña "Iglesia" en el login

**Files:**
- Modify: `src/components/login-form.tsx` (reemplazo completo)

**Interfaces:**
- Consumes:
  - `useAuth()` → `signIn(username, password)`, `signInSector(sectorChurchId: number, password: string)` (Task 2).
  - `fetchSectorChurches(): Promise<SectorChurchOption[]>`, `SectorChurchOption` (Task 2).
- Produces: `LoginForm` con el mismo nombre y props que hoy; `src/app/login/page.tsx` no cambia.

No hay framework de tests de componentes en el repo; esta tarea se verifica en el navegador (Step 2).

- [ ] **Step 1: Reemplazar `src/components/login-form.tsx` completo**

```tsx
'use client';

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { fetchSectorChurches, type SectorChurchOption } from "@/services/sector-login"

type Mode = 'user' | 'church';

const errorMessage = (err: unknown): string =>
  err instanceof Error && err.message
    ? err.message
    : "Error al iniciar sesión. Por favor intenta de nuevo.";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>('user');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [churches, setChurches] = useState<SectorChurchOption[]>([]);
  const [churchesError, setChurchesError] = useState("");
  const [churchId, setChurchId] = useState("");
  const [churchPassword, setChurchPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInSector } = useAuth();

  // La lista de iglesias se pide recién cuando se abre la pestaña.
  useEffect(() => {
    if (mode !== 'church' || churches.length > 0) return;

    let cancelled = false;
    fetchSectorChurches()
      .then((list) => {
        if (cancelled) return;
        setChurches(list);
        setChurchesError(list.length === 0 ? "No hay iglesias disponibles." : "");
      })
      .catch((err: unknown) => {
        if (!cancelled) setChurchesError(errorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [mode, churches.length]);

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(username, password);
      // La redirección se maneja en el contexto
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  const handleChurchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!churchId) {
      setError("Selecciona tu iglesia.");
      return;
    }

    setLoading(true);
    try {
      await signInSector(Number(churchId), churchPassword);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card className="p-0">
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Bienvenido</h1>
            <p className="text-muted-foreground text-balance">
              Inicia sesión en tu cuenta IMPCH Zañartu
            </p>
          </div>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <Tabs
            value={mode}
            onValueChange={(value) => {
              setMode(value as Mode);
              setError("");
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="user" disabled={loading}>Usuario</TabsTrigger>
              <TabsTrigger value="church" disabled={loading}>Iglesia</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleUserSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">Usuario</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>

            <TabsContent value="church">
              <form onSubmit={handleChurchSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="church">Iglesia</FieldLabel>
                    <Select value={churchId} onValueChange={setChurchId} disabled={loading || churches.length === 0}>
                      <SelectTrigger id="church" className="w-full">
                        <SelectValue placeholder="Selecciona tu iglesia" />
                      </SelectTrigger>
                      <SelectContent>
                        {churches.map((church) => (
                          <SelectItem key={church.id} value={String(church.id)}>
                            {church.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {churchesError && (
                      <p className="text-sm text-destructive">{churchesError}</p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="church-password">Clave</FieldLabel>
                    <Input
                      id="church-password"
                      type="password"
                      value={churchPassword}
                      onChange={(e) => setChurchPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <FieldDescription>
                      Si olvidaste la clave, pídela a la administración de Zañartu.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <FieldDescription className="text-center text-sm">
        Al hacer clic en continuar, aceptas nuestros <a href="#" className="underline hover:no-underline">Términos de Servicio</a>{" "}
        y <a href="#" className="underline hover:no-underline">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
```

- [ ] **Step 2: Verificar en el navegador**

Run: `pnpm build`
Expected: termina bien.

Con backend y frontend en `pnpm dev`, abre `http://localhost:3000/login`:

1. La pestaña **Usuario** se ve y funciona como antes con un usuario de Zañartu.
2. La pestaña **Iglesia** muestra las diez iglesias ordenadas, con tildes correctas ("San Fabián", "San Nicolás").
3. Con una clave incorrecta aparece "Credenciales inválidas" y el botón vuelve a habilitarse.
4. Con la clave de `/Users/hquinteb/Desarrollo/Personal/Zañartu/claves-sector.txt` entra a `/dashboard`. El nombre de la iglesia aparece bien escrito abajo en el menú lateral.
5. Al recargar la página, la sesión sigue iniciada.
6. Deteniendo el backend y abriendo la pestaña Iglesia aparece "No se pudo cargar la lista de iglesias. Intenta de nuevo."

El dashboard todavía muestra el de Zañartu con errores de "No autorizado" en la consola: se corrige en la Task 10.

- [ ] **Step 3: Commit**

```bash
git add src/components/login-form.tsx
git commit -m "feat: pestaña de login por iglesia del sector"
```

---

### Task 4: Menú, guard de rutas y marco de página

**Files:**
- Modify: `src/config/sidebar-config.tsx`
- Create: `src/components/sector-route-guard.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/components/page-shell.tsx`

**Interfaces:**
- Consumes: `canAccessPath(roles, pathname)` (Task 1); `useAuth()` (Task 2).
- Produces:
  - `SectorRouteGuard({ children })`, montado en el layout raíz.
  - `PageShell({ children })`: sidebar, header y un contenedor `flex flex-1 flex-col p-6`. Lo usan todas las páginas de las Tasks 5 a 10.

- [ ] **Step 1: Ítems del menú**

En `src/config/sidebar-config.tsx`, darle roles al ítem **Iglesias** (hoy no tiene y se muestra a cualquiera, incluida una cuenta de sector):

```tsx
  {
    title: 'Iglesias',
    path: '/churchs',
    icon: ChurchIcon,
    roles: ['Administrador', 'Pastor', 'Secretario', 'Encargado', 'Tesorero', 'Ofrenda'],
  },
```

Y agregar al final del arreglo `sidebarItems`, después del ítem `Mi Perfil` de `/account`:

```tsx
  {
    title: 'Bautizos',
    path: '/sector/baptism',
    icon: ChildFriendlyIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Matrimonios',
    path: '/sector/merriage',
    icon: WcIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Mi Perfil',
    path: '/sector/profile',
    icon: UserIcon,
    roles: ['PastorSector'],
  },
  {
    title: 'Bautizos Sector',
    path: '/sector/baptism',
    icon: ChildFriendlyIcon,
    roles: ['Administrador'],
  },
  {
    title: 'Matrimonios Sector',
    path: '/sector/merriage',
    icon: WcIcon,
    roles: ['Administrador'],
  },
```

`NavMain` usa `item.title` como `key`. Una cuenta nunca ve dos ítems con el mismo título porque los roles `PastorSector` y los de Zañartu no se combinan.

- [ ] **Step 2: Guard de rutas**

Crear `src/components/sector-route-guard.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { canAccessPath } from '@/lib/sector-access';
import { Loader } from '@/components/loader';

// Devuelve al dashboard a quien entra a una ruta que no corresponde a su rol.
// Es comodidad de interfaz: la protección real está en el backend.
export function SectorRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const allowed = isLoading || !isAuthenticated || canAccessPath(user?.roles, pathname);

  useEffect(() => {
    if (!allowed) router.replace('/dashboard');
  }, [allowed, router]);

  if (!allowed) return <Loader />;

  return <>{children}</>;
}
```

Quien no ha iniciado sesión no pasa por aquí: de eso se encarga `src/middleware.ts`, que ya redirige a `/login`.

- [ ] **Step 3: Montar el guard en `src/app/layout.tsx`**

Agregar el import después del de `AuthProvider`:

```tsx
import { SectorRouteGuard } from "@/components/sector-route-guard";
```

Y envolver `{children}`:

```tsx
          <AuthProvider>
            <SectorRouteGuard>
              {children}
            </SectorRouteGuard>
          </AuthProvider>
```

- [ ] **Step 4: Marco de página**

Crear `src/components/page-shell.tsx`:

```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 5: Verificar**

Run: `pnpm build`
Expected: termina bien.

En el navegador:

1. Como iglesia del sector, el menú muestra solo Dashboard, Bautizos, Matrimonios y Mi Perfil.
2. Escribiendo `http://localhost:3000/bank` o `/members` en la barra de direcciones, vuelve a `/dashboard`.
3. Como administrador de Zañartu, el menú conserva todo lo anterior y agrega "Bautizos Sector" y "Matrimonios Sector".
4. Como un usuario de Zañartu sin rol de administrador, el menú no muestra nada de sector y `/sector/baptism` lo devuelve a `/dashboard`.

Las rutas `/sector/*` todavía dan 404: se crean en las tareas siguientes.

- [ ] **Step 6: Commit**

```bash
git add src/config/sidebar-config.tsx src/components/sector-route-guard.tsx src/app/layout.tsx src/components/page-shell.tsx
git commit -m "feat: menú y guard de rutas para cuentas de sector"
```

---

### Task 5: Formulario de bautizo compartido

**Files:**
- Create: `src/lib/rut.ts`
- Create: `src/components/baptism-form.tsx`
- Modify: `src/app/baptism/register/page.tsx` (reemplazo completo)
- Modify: `src/app/baptism/edit/page.tsx` (reemplazo completo)
- Test: `src/lib/rut.test.ts`

**Interfaces:**
- Consumes: `PageShell` (Task 4); `toTitleCase` de `@/lib/utils` (existente).
- Produces:
  - `formatRutInput(value: string): string`, `isValidRut(value: string): boolean` (`src/lib/rut.ts`)
  - Desde `src/components/baptism-form.tsx`:
    - `interface BaptismFormValues` — once campos de texto: `childRUT`, `childFullName`, `childDateOfBirth`, `fatherRUT`, `fatherFullName`, `motherRUT`, `motherFullName`, `placeOfRegistration`, `baptismDate`, `registrationNumber`, `registrationDate`.
    - `toBaptismFormValues(record: Partial<Record<keyof BaptismFormValues, string | null>>): BaptismFormValues`
    - `BaptismForm(props: { initialValues?: BaptismFormValues; strict?: boolean; submitting: boolean; submitLabel: string; submittingLabel: string; onSubmit: (values: BaptismFormValues) => void | Promise<void>; onCancel: () => void })`

`strict` marca como obligatorios los datos de la madre y del registro. Las pantallas de sector lo usan porque el backend los exige; las de Zañartu no lo pasan, para no cambiar su comportamiento.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/rut.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatRutInput, isValidRut } from './rut.ts';

test('formatea un RUT completo sin importar cómo se escriba', () => {
  assert.equal(formatRutInput('181562714'), '18.156.271-4');
  assert.equal(formatRutInput('18156271-4'), '18.156.271-4');
  assert.equal(formatRutInput('18.156.271-4'), '18.156.271-4');
  assert.equal(formatRutInput(' 18 156 271-4 '), '18.156.271-4');
});

test('la k del dígito verificador queda en mayúscula', () => {
  assert.equal(formatRutInput('12345678-k'), '12.345.678-K');
});

test('mientras se escribe, un RUT incompleto no se formatea', () => {
  assert.equal(formatRutInput('1815'), '1815');
  assert.equal(formatRutInput('1815627'), '1815627');
  assert.equal(formatRutInput(''), '');
  assert.equal(formatRutInput('   '), '');
});

test('valida el dígito verificador', () => {
  assert.equal(isValidRut('18.156.271-4'), true);
  assert.equal(isValidRut('18156271-4'), true);
  assert.equal(isValidRut('18.156.271-5'), false);
});

test('texto que no es un RUT es inválido y no lanza', () => {
  for (const value of ['', 'abc', 'abcdefghij', '-', '....']) {
    assert.equal(isValidRut(value), false, value);
    assert.doesNotThrow(() => formatRutInput(value));
  }
});
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `pnpm test`
Expected: FAIL con `Cannot find module ... rut.ts`.

- [ ] **Step 3: Implementar `src/lib/rut.ts`**

```ts
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
```

- [ ] **Step 4: Ejecutar el test y verificar que pasa**

Run: `pnpm test`
Expected: PASS, 17 tests.

- [ ] **Step 5: Crear `src/components/baptism-form.tsx`**

```tsx
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
```

- [ ] **Step 6: Reemplazar `src/app/baptism/register/page.tsx` completo**

La mutación, el mensaje de éxito y la redirección son los mismos de antes. Único cambio visible: mientras se guarda ya no se reemplaza la página por el loader (eso borraba lo escrito si el guardado fallaba); el botón queda deshabilitado con "Registrando...".

```tsx
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
```

- [ ] **Step 7: Reemplazar `src/app/baptism/edit/page.tsx` completo**

Conserva exactamente la consulta y la mutación actuales. **No corrijas aquí** que la edición use `CREATE_BAPTISM` ni que la consulta pida `getByChildRut`: son problemas previos de las pantallas de Zañartu, fuera del alcance de este plan; se reportan al usuario al terminar.

```tsx
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
```

- [ ] **Step 8: Verificar**

Run: `pnpm test`
Expected: PASS, 17 tests.

Run: `pnpm build`
Expected: termina bien.

En el navegador, como usuario de Zañartu con permiso sobre bautizos:

1. `/baptism/register` se ve igual que antes: mismos campos, mismas etiquetas, solo el RUT del niño, su nombre, su fecha de nacimiento y la fecha de bautismo tienen asterisco.
2. Escribir `181562714` en RUT Niño lo deja como `18.156.271-4`; `18.156.271-5` muestra "RUT inválido" y al enviar aparece el aviso "Por favor, ingresa RUTs válidos."
3. Los nombres se pasan a mayúscula inicial y el número de registro solo acepta dígitos.
4. Registrar un bautizo válido muestra el aviso de éxito y vuelve a `/baptism`.
5. `/baptism/edit?childRUT=...` carga y guarda igual que en `main`, incluidos sus problemas previos. Si necesitas comparar, levanta `main` en otra carpeta con `git worktree add ../frontend-main main`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/rut.ts src/lib/rut.test.ts src/components/baptism-form.tsx src/app/baptism/register/page.tsx src/app/baptism/edit/page.tsx
git commit -m "refactor: extraer el formulario de bautizo a un componente compartido"
```

---

### Task 6: Formulario de matrimonio compartido

**Files:**
- Create: `src/components/merriage-form.tsx`
- Modify: `src/app/merriage/register/page.tsx` (reemplazo completo)
- Modify: `src/app/merriage/edit/page.tsx` (reemplazo completo)

**Interfaces:**
- Consumes: `PageShell` (Task 4); `formatRutInput`, `isValidRut` (Task 5); `toTitleCase` de `@/lib/utils`.
- Produces, desde `src/components/merriage-form.tsx`:
  - `interface MerriageFormValues` — ocho campos de texto: `husbandId`, `fullNameHusband`, `wifeId`, `fullNameWife`, `civilCode`, `civilDate`, `civilPlace`, `religiousDate`.
  - `interface MerriageRecordInput` — los mismos campos ya recortados, con `civilCode: number`. Es lo que recibe `onSubmit`.
  - `toMerriageFormValues(record: { husbandId?: string | null; fullNameHusband?: string | null; wifeId?: string | null; fullNameWife?: string | null; civilCode?: number | string | null; civilDate?: string | null; civilPlace?: string | null; religiousDate?: string | null }): MerriageFormValues`
  - `MerriageForm(props: { initialValues?: MerriageFormValues; submitting: boolean; submitLabel: string; submittingLabel: string; onSubmit: (record: MerriageRecordInput) => void | Promise<void>; onCancel: () => void })`

La lógica de RUT ya está cubierta por `src/lib/rut.test.ts`; esta tarea se verifica en el navegador.

- [ ] **Step 1: Crear `src/components/merriage-form.tsx`**

```tsx
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
```

- [ ] **Step 2: Reemplazar `src/app/merriage/register/page.tsx` completo**

```tsx
'use client';

import { useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CREATE_MERRIAGE } from "@/services/mutation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MerriageForm, type MerriageRecordInput } from "@/components/merriage-form"

export default function RegisterMerriagePage() {
  const router = useRouter();
  const [createMerriage, { data, loading, error }] = useMutation(CREATE_MERRIAGE);

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    try {
      await createMerriage({
        variables: {
          merriageRecord
        }
      });
    } catch (err) {
      console.error('Error creating marriage:', err);
    }
  };

  useEffect(() => {
    if (data) {
      const response = (data as any)?.MerriageRecord?.create;
      if (response?.code === 201) {
        toast.success(response.message || 'Matrimonio registrado exitosamente');
        setTimeout(() => {
          router.push('/merriage');
          // Forzar recarga de la página de listado
          router.refresh();
        }, 1500);
      }
    }
  }, [data, router]);

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Matrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Error al registrar matrimonio: {error.message}
              </AlertDescription>
            </Alert>
          )}
          <MerriageForm
            submitting={loading}
            submitLabel="Registrar Matrimonio"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
```

Se eliminó el `Alert` que se mostraba cuando la respuesta traía `code === 200`: el backend responde 201 al crear, así que nunca aparecía.

- [ ] **Step 3: Reemplazar `src/app/merriage/edit/page.tsx` completo**

Conserva la consulta `GET_ALL_MERRIAGE` (busca el registro en la lista) y la mutación `UPDATE_MERRIAGE`.

```tsx
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
```

- [ ] **Step 4: Verificar**

Run: `pnpm build`
Expected: termina bien.

En el navegador, como usuario de Zañartu con permiso sobre matrimonios:

1. `/merriage/register` se ve igual que antes; todos los campos tienen asterisco.
2. Con un RUT inválido aparece "RUT inválido" y el aviso al enviar.
3. Registrar un matrimonio válido muestra el aviso de éxito y vuelve a `/merriage`.
4. Desde el listado, **Editar** abre el formulario con los datos cargados y los RUT formateados; guardar actualiza y vuelve al listado.

- [ ] **Step 5: Commit**

```bash
git add src/components/merriage-form.tsx src/app/merriage/register/page.tsx src/app/merriage/edit/page.tsx
git commit -m "refactor: extraer el formulario de matrimonio a un componente compartido"
```

---

### Task 7: Documentos GraphQL y piezas comunes de sector

**Files:**
- Create: `src/services/sector-graphql.ts`
- Create: `src/components/sector/confirm-delete-dialog.tsx`
- Create: `src/components/sector/sector-church-filter.tsx`

**Interfaces:**
- Consumes: esquema GraphQL del backend (`SectorBaptismRecord`, `SectorMerriageRecord`, `SectorChurch`).
- Produces, desde `src/services/sector-graphql.ts`:
  - Tipos: `ServiceResult { code: number; message: string }`, `SectorChurchInfo { id: string; name: string; pastor: string | null; address: string | null; phone: string | null }`, `SectorBaptism`, `SectorMerriage`.
  - Documentos: `GET_ALL_SECTOR_BAPTISM`, `GET_SECTOR_BAPTISM_BY_ID`, `CREATE_SECTOR_BAPTISM`, `UPDATE_SECTOR_BAPTISM`, `DELETE_SECTOR_BAPTISM`, `GET_ALL_SECTOR_MERRIAGE`, `GET_SECTOR_MERRIAGE_BY_ID`, `CREATE_SECTOR_MERRIAGE`, `UPDATE_SECTOR_MERRIAGE`, `DELETE_SECTOR_MERRIAGE`, `GET_SECTOR_CHURCHES`, `GET_SECTOR_PROFILE`, `UPDATE_SECTOR_PROFILE`, `CHANGE_SECTOR_PASSWORD`, `GET_SECTOR_COUNTS`.
- Produces, componentes:
  - `ConfirmDeleteDialog(props: { open: boolean; description: string; onCancel: () => void; onConfirm: () => void })`
  - `SectorChurchFilter(props: { value: string; onChange: (value: string) => void })` — `value` es `'all'` o el id de la iglesia como texto. Carga la lista por su cuenta.

- [ ] **Step 1: Crear `src/services/sector-graphql.ts`**

```ts
import { gql } from '@apollo/client';

export interface ServiceResult {
  code: number;
  message: string;
}

export interface SectorChurchInfo {
  id: string;
  name: string;
  pastor: string | null;
  address: string | null;
  phone: string | null;
}

export interface SectorBaptism {
  id: string;
  sectorChurchId: string;
  sectorChurchName: string | null;
  childRUT: string;
  childFullName: string;
  childDateOfBirth: string;
  fatherRUT: string | null;
  fatherFullName: string | null;
  motherRUT: string;
  motherFullName: string;
  placeOfRegistration: string;
  baptismDate: string;
  registrationNumber: string;
  registrationDate: string;
}

export interface SectorMerriage {
  id: string;
  sectorChurchId: string;
  sectorChurchName: string | null;
  husbandId: string;
  fullNameHusband: string;
  wifeId: string;
  fullNameWife: string;
  civilCode: number;
  civilDate: string;
  civilPlace: string;
  religiousDate: string;
}

const BAPTISM_FIELDS = `
  id
  sectorChurchId
  sectorChurchName
  childRUT
  childFullName
  childDateOfBirth
  fatherRUT
  fatherFullName
  motherRUT
  motherFullName
  placeOfRegistration
  baptismDate
  registrationNumber
  registrationDate
`;

const MERRIAGE_FIELDS = `
  id
  sectorChurchId
  sectorChurchName
  husbandId
  fullNameHusband
  wifeId
  fullNameWife
  civilCode
  civilDate
  civilPlace
  religiousDate
`;

// Los nombres de las variables deben coincidir con los de los argumentos:
// el backend también los lee por nombre.

export const GET_ALL_SECTOR_BAPTISM = gql`
  query GetAllSectorBaptism($sectorChurchId: ID) {
    SectorBaptismRecord {
      getAll(sectorChurchId: $sectorChurchId) { ${BAPTISM_FIELDS} }
    }
  }
`;

export const GET_SECTOR_BAPTISM_BY_ID = gql`
  query GetSectorBaptismById($id: ID!) {
    SectorBaptismRecord {
      getById(id: $id) { ${BAPTISM_FIELDS} }
    }
  }
`;

export const CREATE_SECTOR_BAPTISM = gql`
  mutation CreateSectorBaptism($baptismRecord: BaptismRecordInput!) {
    SectorBaptismRecord {
      create(baptismRecord: $baptismRecord) { code message }
    }
  }
`;

export const UPDATE_SECTOR_BAPTISM = gql`
  mutation UpdateSectorBaptism($id: ID!, $baptismRecord: BaptismRecordInput!) {
    SectorBaptismRecord {
      update(id: $id, baptismRecord: $baptismRecord) { code message }
    }
  }
`;

export const DELETE_SECTOR_BAPTISM = gql`
  mutation DeleteSectorBaptism($id: ID!) {
    SectorBaptismRecord {
      delete(id: $id) { code message }
    }
  }
`;

export const GET_ALL_SECTOR_MERRIAGE = gql`
  query GetAllSectorMerriage($sectorChurchId: ID) {
    SectorMerriageRecord {
      getAll(sectorChurchId: $sectorChurchId) { ${MERRIAGE_FIELDS} }
    }
  }
`;

export const GET_SECTOR_MERRIAGE_BY_ID = gql`
  query GetSectorMerriageById($id: ID!) {
    SectorMerriageRecord {
      getById(id: $id) { ${MERRIAGE_FIELDS} }
    }
  }
`;

export const CREATE_SECTOR_MERRIAGE = gql`
  mutation CreateSectorMerriage($merriageRecord: MerriageRecordInput!) {
    SectorMerriageRecord {
      create(merriageRecord: $merriageRecord) { code message }
    }
  }
`;

export const UPDATE_SECTOR_MERRIAGE = gql`
  mutation UpdateSectorMerriage($id: ID!, $merriageRecord: MerriageRecordInput!) {
    SectorMerriageRecord {
      update(id: $id, merriageRecord: $merriageRecord) { code message }
    }
  }
`;

export const DELETE_SECTOR_MERRIAGE = gql`
  mutation DeleteSectorMerriage($id: ID!) {
    SectorMerriageRecord {
      delete(id: $id) { code message }
    }
  }
`;

export const GET_SECTOR_CHURCHES = gql`
  query GetSectorChurches {
    SectorChurch {
      getAll { id name }
    }
  }
`;

export const GET_SECTOR_PROFILE = gql`
  query GetSectorProfile {
    SectorChurch {
      me { id name pastor address phone }
    }
  }
`;

export const UPDATE_SECTOR_PROFILE = gql`
  mutation UpdateSectorProfile($pastor: String, $address: String, $phone: String) {
    SectorChurch {
      updateProfile(pastor: $pastor, address: $address, phone: $phone) { code message }
    }
  }
`;

export const CHANGE_SECTOR_PASSWORD = gql`
  mutation ChangeSectorPassword($currentPassword: String!, $newPassword: String!) {
    SectorChurch {
      changePassword(currentPassword: $currentPassword, newPassword: $newPassword) { code message }
    }
  }
`;

export const GET_SECTOR_COUNTS = gql`
  query GetSectorCounts {
    SectorBaptismRecord { count }
    SectorMerriageRecord { count }
  }
`;
```

- [ ] **Step 2: Crear `src/components/sector/confirm-delete-dialog.tsx`**

```tsx
'use client';

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmDeleteDialogProps {
  open: boolean;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteDialog({ open, description, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            No
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Sí, eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Crear `src/components/sector/sector-church-filter.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GET_SECTOR_CHURCHES } from "@/services/sector-graphql"

interface ChurchesData {
  SectorChurch: { getAll: { id: string; name: string }[] | null } | null;
}

interface SectorChurchFilterProps {
  value: string;
  onChange: (value: string) => void;
}

// Filtro por iglesia para el administrador. 'all' significa todas.
export function SectorChurchFilter({ value, onChange }: SectorChurchFilterProps) {
  const [getChurches, { data }] = useLazyQuery<ChurchesData>(GET_SECTOR_CHURCHES, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getChurches();
  }, [getChurches]);

  const churches = data?.SectorChurch?.getAll ?? [];

  return (
    <div className="space-y-1">
      <Label className="text-xs">Iglesia</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {churches.map((church) => (
            <SelectItem key={church.id} value={String(church.id)}>
              {church.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 4: Verificar**

Run: `pnpm build`
Expected: termina bien.

Run: `pnpm exec eslint src/services/sector-graphql.ts src/components/sector`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/services/sector-graphql.ts src/components/sector
git commit -m "feat: documentos GraphQL y piezas comunes de las pantallas de sector"
```

---

### Task 8: Pantallas de bautizos del sector

**Files:**
- Create: `src/app/sector/baptism/page.tsx`
- Create: `src/app/sector/baptism/register/page.tsx`
- Create: `src/app/sector/baptism/edit/page.tsx`

**Interfaces:**
- Consumes:
  - `PageShell` (Task 4); `useIsAdmin()`, `useIsSector()` (Task 2).
  - `BaptismForm`, `toBaptismFormValues`, `BaptismFormValues` (Task 5).
  - `GET_ALL_SECTOR_BAPTISM`, `GET_SECTOR_BAPTISM_BY_ID`, `CREATE_SECTOR_BAPTISM`, `UPDATE_SECTOR_BAPTISM`, `DELETE_SECTOR_BAPTISM`, `SectorBaptism`, `ServiceResult` (Task 7).
  - `ConfirmDeleteDialog`, `SectorChurchFilter` (Task 7).
  - `generateBaptismCertificate(data)` de `@/lib/certificates/baptism-certificate` (existente, sin cambios).
- Produces: las rutas `/sector/baptism`, `/sector/baptism/register` y `/sector/baptism/edit?id=<id>`.

- [ ] **Step 1: Crear el listado `src/app/sector/baptism/page.tsx`**

```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil, FileDown, MoreVertical, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsAdmin, useIsSector } from "@/hooks/use-roles"
import { generateBaptismCertificate } from "@/lib/certificates/baptism-certificate"
import { ConfirmDeleteDialog } from "@/components/sector/confirm-delete-dialog"
import { SectorChurchFilter } from "@/components/sector/sector-church-filter"
import {
  DELETE_SECTOR_BAPTISM,
  GET_ALL_SECTOR_BAPTISM,
  type SectorBaptism,
  type ServiceResult,
} from "@/services/sector-graphql"

interface AllData {
  SectorBaptismRecord: { getAll: SectorBaptism[] | null } | null;
}

interface DeleteData {
  SectorBaptismRecord: { delete: ServiceResult | null } | null;
}

export default function SectorBaptismPage() {
  const isAdmin = useIsAdmin();
  const isSector = useIsSector();
  const [churchFilter, setChurchFilter] = useState('all');
  const [baptismToDelete, setBaptismToDelete] = useState<string | null>(null);

  const [getBaptisms, { data, loading, error }] = useLazyQuery<AllData>(GET_ALL_SECTOR_BAPTISM, {
    fetchPolicy: 'no-cache',
  });
  const [deleteBaptism] = useMutation<DeleteData>(DELETE_SECTOR_BAPTISM);

  // Un pastor siempre recibe los suyos; el filtro solo lo usa el administrador.
  const reload = useCallback(() => {
    getBaptisms({ variables: { sectorChurchId: churchFilter === 'all' ? null : churchFilter } });
  }, [getBaptisms, churchFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

  const baptisms = data?.SectorBaptismRecord?.getAll ?? [];
  const columns = isAdmin ? 7 : 6;

  const handleDeleteConfirm = async () => {
    if (!baptismToDelete) return;

    try {
      const response = await deleteBaptism({ variables: { id: baptismToDelete } });
      const result = response.data?.SectorBaptismRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Bautizo eliminado exitosamente');
        reload();
      } else {
        toast.error(result?.message || 'Error al eliminar el bautizo');
      }
    } catch (err) {
      toast.error('Error al eliminar el bautizo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setBaptismToDelete(null);
    }
  };

  const downloadCertificate = (baptism: SectorBaptism) => {
    // El certificado escribe el texto tal cual: un padre sin datos debe quedar
    // en blanco, no como "null".
    generateBaptismCertificate({ ...baptism, fatherFullName: baptism.fatherFullName ?? '' });
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <CardTitle>{isAdmin ? 'Bautizos del Sector' : 'Bautizos'}</CardTitle>
            <div className="flex items-end gap-3">
              {isAdmin && <SectorChurchFilter value={churchFilter} onChange={setChurchFilter} />}
              {isSector && (
                <Button asChild>
                  <Link href="/sector/baptism/register">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Bautizo
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error al cargar bautizos: {error.message}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin && <TableHead>Iglesia</TableHead>}
                    <TableHead>Niño/a</TableHead>
                    <TableHead>RUT</TableHead>
                    <TableHead>Padre</TableHead>
                    <TableHead>Madre</TableHead>
                    <TableHead>Fecha Bautismo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : baptisms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        No hay bautizos disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    baptisms.map((baptism) => (
                      <TableRow key={baptism.id}>
                        {isAdmin && <TableCell>{baptism.sectorChurchName || '-'}</TableCell>}
                        <TableCell>{baptism.childFullName || '-'}</TableCell>
                        <TableCell>{baptism.childRUT || '-'}</TableCell>
                        <TableCell>{baptism.fatherFullName || '-'}</TableCell>
                        <TableCell>{baptism.motherFullName || '-'}</TableCell>
                        <TableCell>{baptism.baptismDate || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Acciones">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/sector/baptism/edit?id=${encodeURIComponent(baptism.id)}`} className="flex items-center w-full">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setBaptismToDelete(baptism.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => downloadCertificate(baptism)}>
                                <FileDown className="h-4 w-4 mr-2" />
                                Certificado
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={baptismToDelete !== null}
        description="¿Estás seguro de que deseas eliminar este bautizo? Esta acción no se puede deshacer."
        onCancel={() => setBaptismToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  )
}
```

- [ ] **Step 2: Crear el registro `src/app/sector/baptism/register/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BaptismForm, type BaptismFormValues } from "@/components/baptism-form"
import { CREATE_SECTOR_BAPTISM, type ServiceResult } from "@/services/sector-graphql"

interface CreateData {
  SectorBaptismRecord: { create: ServiceResult | null } | null;
}

export default function RegisterSectorBaptismPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [createBaptism, { loading }] = useMutation<CreateData>(CREATE_SECTOR_BAPTISM);

  const handleSubmit = async (baptism: BaptismFormValues) => {
    setErrorMessage('');
    try {
      const response = await createBaptism({ variables: { baptismRecord: baptism } });
      const result = response.data?.SectorBaptismRecord?.create;
      if (result?.code === 201) {
        toast.success(result.message || 'Bautizo registrado exitosamente');
        router.push('/sector/baptism');
      } else {
        setErrorMessage(result?.message || 'No se pudo registrar el bautizo');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo registrar el bautizo');
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Bautizo</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <BaptismForm
            strict
            submitting={loading}
            submitLabel="Registrar Bautizo"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/baptism')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
```

- [ ] **Step 3: Crear la edición `src/app/sector/baptism/edit/page.tsx`**

```tsx
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

  const [getBaptism, { data, loading: queryLoading, called }] = useLazyQuery<ByIdData>(GET_SECTOR_BAPTISM_BY_ID, {
    fetchPolicy: 'no-cache',
  });
  const [updateBaptism, { loading }] = useMutation<UpdateData>(UPDATE_SECTOR_BAPTISM);

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
```

- [ ] **Step 4: Verificar**

Run: `pnpm build`
Expected: termina bien.

Run: `pnpm exec eslint src/app/sector/baptism`
Expected: sin errores.

En el navegador, con dos iglesias (por ejemplo Bulnes y Coihueco) y el administrador:

1. Como **Bulnes**: `/sector/baptism` muestra "Bautizos", sin columna Iglesia ni filtro, con el botón "Nuevo Bautizo".
2. En el formulario, los datos de la madre y del registro tienen asterisco y el navegador no deja enviar sin ellos.
3. Registrar un bautizo válido vuelve al listado y aparece la fila.
4. Registrar otra vez el mismo RUT muestra en rojo "Registro de bautizo ya existe para este RUT", y lo escrito en el formulario se conserva.
5. **Certificado** descarga `CertificadoBautizo_<RUT>.pdf` con la misma plantilla de Zañartu. Registrando un bautizo sin padre, el PDF deja ese renglón en blanco (no dice "null").
6. **Editar** abre el formulario con los datos; al guardar, el listado muestra el cambio.
7. **Eliminar** pide confirmación y quita la fila.
8. Como **Coihueco**: el listado está vacío. Abriendo a mano `/sector/baptism/edit?id=<id de Bulnes>` aparece "Registro no encontrado".
9. Como **administrador**: el título es "Bautizos del Sector", hay columna Iglesia y filtro, no hay botón "Nuevo Bautizo"; el filtro por iglesia funciona; puede editar y eliminar. `/sector/baptism/register` lo devuelve a `/dashboard`.

- [ ] **Step 5: Commit**

```bash
git add src/app/sector/baptism
git commit -m "feat: pantallas de bautizos del sector"
```

---

### Task 9: Pantallas de matrimonios del sector

**Files:**
- Create: `src/app/sector/merriage/page.tsx`
- Create: `src/app/sector/merriage/register/page.tsx`
- Create: `src/app/sector/merriage/edit/page.tsx`

**Interfaces:**
- Consumes:
  - `PageShell` (Task 4); `useIsAdmin()`, `useIsSector()` (Task 2).
  - `MerriageForm`, `toMerriageFormValues`, `MerriageRecordInput` (Task 6).
  - `GET_ALL_SECTOR_MERRIAGE`, `GET_SECTOR_MERRIAGE_BY_ID`, `CREATE_SECTOR_MERRIAGE`, `UPDATE_SECTOR_MERRIAGE`, `DELETE_SECTOR_MERRIAGE`, `SectorMerriage`, `ServiceResult` (Task 7).
  - `ConfirmDeleteDialog`, `SectorChurchFilter` (Task 7).
  - `generateMarriageCertificate(data)` de `@/lib/certificates/marriage-certificate` (existente, sin cambios).
- Produces: las rutas `/sector/merriage`, `/sector/merriage/register` y `/sector/merriage/edit?id=<id>`.

- [ ] **Step 1: Crear el listado `src/app/sector/merriage/page.tsx`**

```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import Link from 'next/link';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/solid"
import { Pencil, FileDown, MoreVertical, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsAdmin, useIsSector } from "@/hooks/use-roles"
import { generateMarriageCertificate } from "@/lib/certificates/marriage-certificate"
import { ConfirmDeleteDialog } from "@/components/sector/confirm-delete-dialog"
import { SectorChurchFilter } from "@/components/sector/sector-church-filter"
import {
  DELETE_SECTOR_MERRIAGE,
  GET_ALL_SECTOR_MERRIAGE,
  type SectorMerriage,
  type ServiceResult,
} from "@/services/sector-graphql"

interface AllData {
  SectorMerriageRecord: { getAll: SectorMerriage[] | null } | null;
}

interface DeleteData {
  SectorMerriageRecord: { delete: ServiceResult | null } | null;
}

export default function SectorMerriagePage() {
  const isAdmin = useIsAdmin();
  const isSector = useIsSector();
  const [churchFilter, setChurchFilter] = useState('all');
  const [marriageToDelete, setMarriageToDelete] = useState<string | null>(null);

  const [getMarriages, { data, loading, error }] = useLazyQuery<AllData>(GET_ALL_SECTOR_MERRIAGE, {
    fetchPolicy: 'no-cache',
  });
  const [deleteMerriage] = useMutation<DeleteData>(DELETE_SECTOR_MERRIAGE);

  // Un pastor siempre recibe los suyos; el filtro solo lo usa el administrador.
  const reload = useCallback(() => {
    getMarriages({ variables: { sectorChurchId: churchFilter === 'all' ? null : churchFilter } });
  }, [getMarriages, churchFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

  const marriages = data?.SectorMerriageRecord?.getAll ?? [];
  const columns = isAdmin ? 7 : 6;

  const handleDeleteConfirm = async () => {
    if (!marriageToDelete) return;

    try {
      const response = await deleteMerriage({ variables: { id: marriageToDelete } });
      const result = response.data?.SectorMerriageRecord?.delete;
      if (result?.code === 200) {
        toast.success(result.message || 'Matrimonio eliminado exitosamente');
        reload();
      } else {
        toast.error(result?.message || 'Error al eliminar el matrimonio');
      }
    } catch (err) {
      toast.error('Error al eliminar el matrimonio: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setMarriageToDelete(null);
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <CardTitle>{isAdmin ? 'Matrimonios del Sector' : 'Matrimonios'}</CardTitle>
            <div className="flex items-end gap-3">
              {isAdmin && <SectorChurchFilter value={churchFilter} onChange={setChurchFilter} />}
              {isSector && (
                <Button asChild>
                  <Link href="/sector/merriage/register">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nuevo Matrimonio
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error al cargar matrimonios: {error.message}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin && <TableHead>Iglesia</TableHead>}
                    <TableHead>Esposo</TableHead>
                    <TableHead>Esposa</TableHead>
                    <TableHead>Fecha Civil</TableHead>
                    <TableHead>Fecha Religiosa</TableHead>
                    <TableHead>Lugar</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : marriages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns} className="text-center text-muted-foreground">
                        No hay matrimonios disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    marriages.map((marriage) => (
                      <TableRow key={marriage.id}>
                        {isAdmin && <TableCell>{marriage.sectorChurchName || '-'}</TableCell>}
                        <TableCell>{marriage.fullNameHusband || '-'}</TableCell>
                        <TableCell>{marriage.fullNameWife || '-'}</TableCell>
                        <TableCell>{marriage.civilDate || '-'}</TableCell>
                        <TableCell>{marriage.religiousDate || '-'}</TableCell>
                        <TableCell>{marriage.civilPlace || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label="Acciones">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/sector/merriage/edit?id=${encodeURIComponent(marriage.id)}`} className="flex items-center w-full">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setMarriageToDelete(marriage.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => generateMarriageCertificate(marriage)}>
                                <FileDown className="h-4 w-4 mr-2" />
                                Certificado
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={marriageToDelete !== null}
        description="¿Estás seguro de que deseas eliminar este matrimonio? Esta acción no se puede deshacer."
        onCancel={() => setMarriageToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </PageShell>
  )
}
```

- [ ] **Step 2: Crear el registro `src/app/sector/merriage/register/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MerriageForm, type MerriageRecordInput } from "@/components/merriage-form"
import { CREATE_SECTOR_MERRIAGE, type ServiceResult } from "@/services/sector-graphql"

interface CreateData {
  SectorMerriageRecord: { create: ServiceResult | null } | null;
}

export default function RegisterSectorMerriagePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [createMerriage, { loading }] = useMutation<CreateData>(CREATE_SECTOR_MERRIAGE);

  const handleSubmit = async (merriageRecord: MerriageRecordInput) => {
    setErrorMessage('');
    try {
      const response = await createMerriage({ variables: { merriageRecord } });
      const result = response.data?.SectorMerriageRecord?.create;
      if (result?.code === 201) {
        toast.success(result.message || 'Matrimonio registrado exitosamente');
        router.push('/sector/merriage');
      } else {
        setErrorMessage(result?.message || 'No se pudo registrar el matrimonio');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo registrar el matrimonio');
    }
  };

  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Registrar Matrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <MerriageForm
            submitting={loading}
            submitLabel="Registrar Matrimonio"
            submittingLabel="Registrando..."
            onSubmit={handleSubmit}
            onCancel={() => router.push('/sector/merriage')}
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
```

- [ ] **Step 3: Crear la edición `src/app/sector/merriage/edit/page.tsx`**

```tsx
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

  const [getMerriage, { data, loading: queryLoading, called }] = useLazyQuery<ByIdData>(GET_SECTOR_MERRIAGE_BY_ID, {
    fetchPolicy: 'no-cache',
  });
  const [updateMerriage, { loading }] = useMutation<UpdateData>(UPDATE_SECTOR_MERRIAGE);

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
```

- [ ] **Step 4: Verificar**

Run: `pnpm build`
Expected: termina bien.

Run: `pnpm exec eslint src/app/sector/merriage`
Expected: sin errores.

En el navegador, igual que en la Task 8 pero con matrimonios:

1. Como **Bulnes**: registrar un matrimonio, verlo en el listado, editarlo y descargar `CertificadoMatrimonio_<id>.pdf` con la plantilla de Zañartu.
2. Eliminar pide confirmación y quita la fila.
3. Como **Coihueco**: listado vacío; `/sector/merriage/edit?id=<id de Bulnes>` muestra "Registro no encontrado".
4. Como **administrador**: título "Matrimonios del Sector", columna Iglesia, filtro, sin botón de crear; puede editar y eliminar.

- [ ] **Step 5: Commit**

```bash
git add src/app/sector/merriage
git commit -m "feat: pantallas de matrimonios del sector"
```

---

### Task 10: Perfil y dashboard de sector

**Files:**
- Create: `src/app/sector/profile/page.tsx`
- Create: `src/components/sector-dashboard.tsx`
- Modify: `src/app/dashboard/page.tsx`

**Interfaces:**
- Consumes:
  - `PageShell` (Task 4); `useAuth()`, `useIsSector()` (Task 2).
  - `GET_SECTOR_PROFILE`, `UPDATE_SECTOR_PROFILE`, `CHANGE_SECTOR_PASSWORD`, `GET_SECTOR_COUNTS`, `SectorChurchInfo`, `ServiceResult` (Task 7).
- Produces: la ruta `/sector/profile`; `SectorDashboard()`; `/dashboard` muestra `SectorDashboard` a las cuentas de sector y el dashboard actual al resto.

- [ ] **Step 1: Crear `src/app/sector/profile/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CHANGE_SECTOR_PASSWORD,
  GET_SECTOR_PROFILE,
  UPDATE_SECTOR_PROFILE,
  type SectorChurchInfo,
  type ServiceResult,
} from "@/services/sector-graphql"

const MIN_PASSWORD_LENGTH = 8;

interface ProfileData {
  SectorChurch: { me: SectorChurchInfo | null } | null;
}

interface UpdateProfileData {
  SectorChurch: { updateProfile: ServiceResult | null } | null;
}

interface ChangePasswordData {
  SectorChurch: { changePassword: ServiceResult | null } | null;
}

const messageOf = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export default function SectorProfilePage() {
  const [getProfile, { data, loading, error }] = useLazyQuery<ProfileData>(GET_SECTOR_PROFILE, {
    fetchPolicy: 'no-cache',
  });
  const [updateProfile, { loading: savingProfile }] = useMutation<UpdateProfileData>(UPDATE_SECTOR_PROFILE);
  const [changePassword, { loading: savingPassword }] = useMutation<ChangePasswordData>(CHANGE_SECTOR_PASSWORD);

  const [profile, setProfile] = useState({ pastor: '', address: '', phone: '' });
  const [profileError, setProfileError] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const church = data?.SectorChurch?.me ?? null;

  useEffect(() => {
    if (church) {
      setProfile({
        pastor: church.pastor ?? '',
        address: church.address ?? '',
        phone: church.phone ?? '',
      });
    }
  }, [church]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    try {
      const response = await updateProfile({ variables: profile });
      const result = response.data?.SectorChurch?.updateProfile;
      if (result?.code === 200) {
        toast.success(result.message || 'Perfil actualizado exitosamente');
      } else {
        setProfileError(result?.message || 'No se pudo actualizar el perfil');
      }
    } catch (err) {
      setProfileError(messageOf(err, 'No se pudo actualizar el perfil'));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwords.next.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`La nueva clave debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError('La nueva clave y su confirmación no coinciden.');
      return;
    }

    try {
      const response = await changePassword({
        variables: { currentPassword: passwords.current, newPassword: passwords.next },
      });
      const result = response.data?.SectorChurch?.changePassword;
      if (result?.code === 200) {
        toast.success(result.message || 'Clave cambiada exitosamente');
        setPasswords({ current: '', next: '', confirm: '' });
      } else {
        setPasswordError(result?.message || 'No se pudo cambiar la clave');
      }
    } catch (err) {
      setPasswordError(messageOf(err, 'No se pudo cambiar la clave'));
    }
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">Error al cargar el perfil: {error.message}</p>
            ) : loading || !church ? (
              <p className="text-muted-foreground">Cargando...</p>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Iglesia</p>
                  <p className="text-lg">{church.name}</p>
                </div>
                {profileError && (
                  <Alert variant="destructive">
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pastor">Pastor</Label>
                    <Input
                      id="pastor"
                      value={profile.pastor}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, pastor: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      maxLength={255}
                      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar clave</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Clave actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    autoComplete="current-password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva clave</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwords.next}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, next: e.target.value }))}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground">Mínimo {MIN_PASSWORD_LENGTH} caracteres.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Repetir nueva clave</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? 'Cambiando...' : 'Cambiar clave'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 2: Crear `src/components/sector-dashboard.tsx`**

```tsx
'use client';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import Link from 'next/link';
import { Baby, Heart } from "lucide-react"
import { PlusIcon } from "@heroicons/react/24/solid"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { GET_SECTOR_COUNTS } from "@/services/sector-graphql"

interface CountsData {
  SectorBaptismRecord: { count: number | null } | null;
  SectorMerriageRecord: { count: number | null } | null;
}

interface CountCardProps {
  label: string;
  value: number | null;
  icon: React.ComponentType<{ className?: string }>;
  listHref: string;
  createHref: string;
  createLabel: string;
}

function CountCard({ label, value, icon: Icon, listHref, createHref, createLabel }: CountCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase">{label}</p>
            <p className="text-3xl font-bold">{value ?? '-'}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={createHref}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {createLabel}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={listHref}>Ver todos</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SectorDashboard() {
  const { user } = useAuth();
  const [getCounts, { data, error }] = useLazyQuery<CountsData>(GET_SECTOR_COUNTS, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getCounts();
  }, [getCounts]);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        {error && (
          <p className="text-destructive">Error al cargar el resumen: {error.message}</p>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CountCard
            label="Bautizos"
            value={data?.SectorBaptismRecord?.count ?? null}
            icon={Baby}
            listHref="/sector/baptism"
            createHref="/sector/baptism/register"
            createLabel="Nuevo Bautizo"
          />
          <CountCard
            label="Matrimonios"
            value={data?.SectorMerriageRecord?.count ?? null}
            icon={Heart}
            listHref="/sector/merriage"
            createHref="/sector/merriage/register"
            createLabel="Nuevo Matrimonio"
          />
        </div>
      </div>
    </PageShell>
  );
}
```

- [ ] **Step 3: Elegir el dashboard según el rol en `src/app/dashboard/page.tsx`**

Tres ediciones puntuales; el resto del archivo no cambia.

Cambiar el import de hooks de roles:

```tsx
import { useIsAdmin } from "@/hooks/use-roles"
```

por:

```tsx
import { useIsAdmin, useIsSector } from "@/hooks/use-roles"
import { useAuth } from "@/contexts/auth-context"
import { SectorDashboard } from "@/components/sector-dashboard"
```

Cambiar la declaración del componente actual:

```tsx
export default function Page() {
  const isAdmin = useIsAdmin();
```

por:

```tsx
function MainDashboard() {
  const isAdmin = useIsAdmin();
```

Y agregar al final del archivo:

```tsx

export default function Page() {
  const { isLoading } = useAuth();
  const isSector = useIsSector();

  // Hasta saber quién es el usuario no se monta ningún dashboard: el de
  // Zañartu dispara consultas que una cuenta de sector no puede hacer.
  if (isLoading) return <Loader />;

  return isSector ? <SectorDashboard /> : <MainDashboard />;
}
```

`Loader` ya está importado en ese archivo.

- [ ] **Step 4: Verificar**

Run: `pnpm build`
Expected: termina bien.

Run: `pnpm exec eslint src/app/sector/profile src/components/sector-dashboard.tsx`
Expected: sin errores.

En el navegador:

1. Como **Bulnes**, `/dashboard` muestra el nombre de la iglesia y dos tarjetas, Bautizos y Matrimonios, con los totales reales de su iglesia. No aparecen Ofrendas, Miembros ni Banco.
2. En la pestaña Red de las herramientas del navegador, al cargar `/dashboard` solo sale la operación `GetSectorCounts`; ninguna de ofrendas, banco, gastos o miembros. La consola no muestra errores "No autorizado".
3. Los botones "Nuevo Bautizo" y "Nuevo Matrimonio" llevan a los formularios.
4. `/sector/profile` muestra el nombre de la iglesia. Editar pastor, dirección y teléfono, guardar y recargar: los datos se conservan.
5. Cambiar la clave con la actual incorrecta muestra "Clave actual incorrecta"; con una nueva de 7 caracteres, el aviso de mínimo 8; con dos claves distintas, que no coinciden. Con datos correctos avisa del éxito; cerrar sesión y entrar con la clave nueva funciona, y con la anterior ya no.
6. Como **usuario de Zañartu**, `/dashboard` se ve exactamente igual que antes.

- [ ] **Step 5: Commit**

```bash
git add src/app/sector/profile src/components/sector-dashboard.tsx src/app/dashboard/page.tsx
git commit -m "feat: perfil y dashboard de las cuentas de sector"
```

---

### Task 11: Verificación final

**Files:** ninguno nuevo.

- [ ] **Step 1: Tests, lint y build**

Run: `pnpm test`
Expected: PASS, 17 tests, 0 fallos.

Run: `pnpm build`
Expected: termina bien y la lista de rutas incluye `/sector/baptism`, `/sector/baptism/edit`, `/sector/baptism/register`, `/sector/merriage`, `/sector/merriage/edit`, `/sector/merriage/register` y `/sector/profile`.

```bash
pnpm exec eslint src/lib src/services/sector-login.ts src/services/sector-graphql.ts \
  src/components/sector src/components/sector-dashboard.tsx src/components/sector-route-guard.tsx \
  src/components/page-shell.tsx src/components/baptism-form.tsx src/components/merriage-form.tsx \
  src/components/login-form.tsx src/contexts/auth-context.tsx src/hooks/use-roles.ts src/app/sector
```

Expected: sin errores en los archivos nuevos o reescritos.

Run: `pnpm lint 2>&1 | tail -5`
Expected: la cantidad de errores no supera la línea base anotada en la Task 0.

- [ ] **Step 2: Nada cambió en los certificados**

```bash
git diff main --stat -- src/lib/certificates
```

Expected: salida vacía.

- [ ] **Step 3: Recorrido completo de punta a punta**

Con el backend y el frontend en `pnpm dev`, y la base local recién sembrada:

1. Entrar como **San Fabián** (comprueba que el nombre con tilde se ve bien en el menú).
2. Registrar un bautizo y un matrimonio. Descargar ambos certificados y abrirlos.
3. Recargar la página: la sesión sigue iniciada.
4. Escribir `/bank`, `/members`, `/customers`, `/baptism` en la barra: todas devuelven a `/dashboard`.
5. Cerrar sesión. Entrar como **Coihueco**: dashboard en cero, listados vacíos.
6. Cerrar sesión. Entrar como **administrador de Zañartu**: "Bautizos Sector" y "Matrimonios Sector" muestran los registros de San Fabián con su iglesia; filtrar por Coihueco deja la tabla vacía; editar un registro de San Fabián funciona.
7. Como administrador, las pantallas de Zañartu (`/baptism`, `/merriage`, `/offering`, `/dashboard`) siguen igual.
8. Probar la app en un ancho de teléfono (375 px): el login con pestañas, el listado y los formularios no se desbordan.

Si algún paso falla, corrígelo antes de continuar y vuelve a ejecutar el Step 1.

- [ ] **Step 4: Notas para el usuario**

No hay nada que commitear en este paso. Incluye en el mensaje final:

1. **Despliegue:** si se usan `NEXT_PUBLIC_PATHLOGIN` u otras rutas personalizadas en producción, las nuevas son `NEXT_PUBLIC_PATHSECTORCHURCHES` (por defecto `/auth/sector-churches`) y `NEXT_PUBLIC_PATHSECTORLOGIN` (por defecto `/auth/sector-login`).
2. **Operaciones GraphQL nuevas** (el cliente las agrega a la URL como `/graphql/<nombre>`; si un proxy filtra por nombre, hay que permitirlas): `GetAllSectorBaptism`, `GetSectorBaptismById`, `CreateSectorBaptism`, `UpdateSectorBaptism`, `DeleteSectorBaptism`, `GetAllSectorMerriage`, `GetSectorMerriageById`, `CreateSectorMerriage`, `UpdateSectorMerriage`, `DeleteSectorMerriage`, `GetSectorChurches`, `GetSectorProfile`, `UpdateSectorProfile`, `ChangeSectorPassword`, `GetSectorCounts`.
3. **Problemas previos de Zañartu que no se tocaron:** la edición de bautizos (`/baptism/edit`) guarda con la mutación de crear y consulta `getByChildRut`, mientras el esquema del backend define `getByChildRUT`; conviene revisarla aparte. Además, el certificado de bautizo de Zañartu imprime "null" si el padre no tiene nombre.
4. **Cambio menor en Zañartu:** al guardar un bautizo o matrimonio ya no se reemplaza la pantalla por el loader; el botón queda deshabilitado mientras guarda y lo escrito se conserva si hay un error.
