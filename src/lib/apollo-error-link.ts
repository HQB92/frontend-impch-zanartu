import { onError } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

const AUTH_CODES = new Set(['UNAUTHENTICATED', 'FORBIDDEN']);
const AUTH_MESSAGES = ['not authenticated', 'You are not authenticated'];

const isAuthError = (message: string, extensions?: Record<string, unknown>) => {
  if (extensions?.code && AUTH_CODES.has(extensions.code as string)) return true;
  return AUTH_MESSAGES.some((m) => message.includes(m));
};

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('authenticated');
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('profile');
  document.cookie = 'auth-session=; path=/; max-age=0';
  window.location.href = '/login';
};

export const errorLink = onError(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const { message, locations, path, extensions } of error.errors) {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      if (isAuthError(message, extensions as Record<string, unknown>)) {
        redirectToLogin();
        return;
      }
    }
  } else if (error) {
    console.error(`[Network error]: ${error}`);
    if ('statusCode' in (error as unknown as Record<string, unknown>) && (error as unknown as Record<string, unknown>).statusCode === 401) {
      redirectToLogin();
    }
  }
});
