import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Si el error es de autenticación, limpiar el localStorage y redirigir al login
      if (message.includes('not authenticated') || message.includes('Authorization') || message.includes('Invalid token')) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('authenticated');
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('profile');
          // Usar window.location para forzar una recarga completa
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Si es un error 401 (Unauthorized), redirigir al login
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('authenticated');
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('profile');
        window.location.href = '/login';
      }
    }
  }
});
