import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HttpLink para la URI de GraphQL
const customFetch = (uri, options) => {
    const { operationName } = JSON.parse(options.body);
    console.log('operation', JSON.parse(options.body));
    return fetch(`${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_PATCHGRAPHQL}/${operationName}`, options);
};
const httpLink = new HttpLink({ fetch: customFetch });

// Obtener el token de sesión
let token = typeof window !== 'undefined' ? window.sessionStorage.getItem('token') : null;

// Enlace de autenticación para agregar el token a las cabeceras
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

// Enlace para agregar un identificador único a cada solicitud
const uniqueLink = new ApolloLink((operation, forward) => {

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'x-operation-name': `${operation.operationName}`
        }
    }));
    return forward(operation);
});

// que ese operador seA el nombre de la consulta

const operationNameLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'x-operation-name': operation.operationName
        }
    }));
    return forward(operation);
})


// Configurar Apollo Client
const client = new ApolloClient({
    link: ApolloLink.from([authLink, uniqueLink, httpLink, operationNameLink]),
    cache: new InMemoryCache({
        addTypename: false,
    }),
});

export default client;
