// lib/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';


const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_PATCHGRAPHQL}`,
});

let token = typeof window !== 'undefined' ? window.sessionStorage.getItem('token') : null;

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});


export default client;
