import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HttpLink para la URI de GraphQL
const customFetch = (uri, options) => {
    const { operationName } = JSON.parse(options.body);
    return fetch(`${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_PATCHGRAPHQL}/${operationName}`, options);
};

const httpLink = new HttpLink({ fetch: customFetch });

// Función para obtener y validar el token
const getValidToken = () => {
    if (typeof window === 'undefined') return null;

    const token = window.localStorage.getItem('token');
    if (!token) return null;

    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= exp * 1000) {
            // Token expirado, limpiarlo
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('authenticated');
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('profile');
            return null;
        }
        return token;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};

// Enlace de autenticación para agregar el token a las cabeceras
const authLink = setContext((_, { headers }) => {
    const token = getValidToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Configurar Apollo Client
const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache({
        addTypename: false,
    }),
    connectToDevTools: true,
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    },
});

export default client;
