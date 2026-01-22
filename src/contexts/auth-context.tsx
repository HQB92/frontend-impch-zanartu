'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/login';

interface User {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  rut?: string;
  roles?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  signIn: (username: string, password: string) => Promise<void>;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const initialized = useRef(false);
  const router = useRouter();

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    if (typeof window === 'undefined') {
      dispatch({ type: 'INITIALIZE' });
      return;
    }

    let isAuthenticated = false;

    try {
      // Check both the authenticated flag and the token validity
      const authenticatedFlag = window.localStorage.getItem('authenticated') === 'true';
      const token = window.localStorage.getItem('token');
      
      if (authenticatedFlag && token) {
        // Validate token format and expiration
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const decoded = JSON.parse(atob(tokenParts[1]));
            const exp = decoded.exp;
            
            // Check if token is expired
            if (exp && Date.now() >= exp * 1000) {
              // Token expired, clear auth data
              window.localStorage.removeItem('token');
              window.localStorage.removeItem('authenticated');
              window.localStorage.removeItem('user');
              window.localStorage.removeItem('profile');
              isAuthenticated = false;
            } else {
              isAuthenticated = true;
            }
          } catch (decodeError) {
            // Token can't be decoded, consider it invalid
            console.error('Error decoding token:', decodeError);
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('authenticated');
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('profile');
            isAuthenticated = false;
          }
        } else {
          // Invalid token format
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('authenticated');
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('profile');
          isAuthenticated = false;
        }
      } else {
        // No token or authenticated flag is false
        isAuthenticated = false;
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
      isAuthenticated = false;
    }

    if (isAuthenticated) {
      try {
        const userData = window.localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        dispatch({
          type: 'INITIALIZE',
          payload: user,
        });
      } catch (err) {
        console.error('Error parsing user data:', err);
        dispatch({ type: 'INITIALIZE' });
      }
    } else {
      dispatch({ type: 'INITIALIZE' });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const signIn = async (username: string, password: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot sign in on server');
    }

    try {
      const token = await login(username, password);
      let user: User | null = null;

      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          user = {
            id: decoded.userId || decoded.id,
            name: decoded.username || decoded.name,
            email: decoded.email,
            rut: decoded.rut,
            roles: decoded.roles,
          };

          window.localStorage.setItem('authenticated', 'true');
          window.localStorage.setItem('token', token);
          window.localStorage.setItem('user', JSON.stringify(user));

          dispatch({
            type: 'SIGN_IN',
            payload: user,
          });

          // Redirigir al dashboard después del login exitoso
          router.push('/dashboard');
        } catch (err) {
          console.error('Error parsing token:', err);
          dispatch({ type: 'SIGN_OUT' });
          throw new Error('Error al procesar la respuesta del servidor');
        }
      } else {
        dispatch({ type: 'SIGN_OUT' });
        throw new Error('Por favor revisa tus credenciales');
      }
    } catch (err: any) {
      // Re-lanzar el error con el mensaje original para que se muestre en el formulario
      dispatch({ type: 'SIGN_OUT' });
      throw err;
    }
  };

  const signOut = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('profile');
      window.localStorage.removeItem('authenticated');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
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
