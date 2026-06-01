import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

declare module '@apollo/client' {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery { errorPolicy: 'all'; }
      interface Query { errorPolicy: 'all'; }
    }
  }
}
import { setContext } from '@apollo/client/link/context';
import { errorLink } from './apollo-error-link';

const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const graphqlPath = process.env.NEXT_PUBLIC_PATCHGRAPHQL || '/graphql';

  let operationName = '';
  if (init?.body) {
    try {
      const body = typeof init.body === 'string' ? init.body : init.body.toString();
      operationName = JSON.parse(body).operationName || '';
    } catch {
      // use base path
    }
  }

  const url = operationName
    ? `${baseUrl}${graphqlPath}/${operationName}`
    : `${baseUrl}${graphqlPath}`;

  return fetch(url, init);
};

const httpLink = new HttpLink({ fetch: customFetch });

const clearAuthStorage = () => {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('authenticated');
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('profile');
  document.cookie = 'auth-session=; path=/; max-age=0';
};

const getValidToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const token = window.localStorage.getItem('token');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) {
    clearAuthStorage();
    return null;
  }

  try {
    const { exp } = JSON.parse(atob(parts[1]));
    if (exp && Date.now() >= exp * 1000) {
      clearAuthStorage();
      return null;
    }
  } catch {
    // Token can't be decoded — send it anyway, backend will reject
  }

  return token;
};

const authLink = setContext((_, { headers }) => {
  const token = getValidToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
});

export default client;
