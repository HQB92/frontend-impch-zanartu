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
