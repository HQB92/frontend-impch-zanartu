import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { errorLink } from './apollo-error-link';

// HttpLink para la URI de GraphQL
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!init?.body) return fetch(input, init);
    
    const body = typeof init.body === 'string' ? init.body : init.body.toString();
    let operationName = '';
    
    try {
        const parsedBody = JSON.parse(body);
        operationName = parsedBody.operationName || '';
    } catch (e) {
        console.error('[Apollo Client] Error parsing request body:', e);
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_URL || '';
    const graphqlPath = process.env.NEXT_PUBLIC_PATCHGRAPHQL || '/graphql';
    
    // Construir la URL completa
    const url = operationName 
        ? `${baseUrl}${graphqlPath}/${operationName}`
        : `${baseUrl}${graphqlPath}`;
    
    // Manejar headers correctamente y asegurar que solo haya un header Authorization
    const headersObj: Record<string, string> = {};
    
    if (init.headers) {
        if (init.headers instanceof Headers) {
            // Convertir Headers a objeto plano, normalizando claves
            init.headers.forEach((value, key) => {
                const normalizedKey = key.toLowerCase();
                // Solo tomar el primer valor si hay duplicados
                if (!headersObj[normalizedKey]) {
                    headersObj[normalizedKey] = value;
                }
            });
        } else if (Array.isArray(init.headers)) {
            // Si es un array, convertirlo a objeto
            init.headers.forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase();
                // Solo tomar el primer valor si hay duplicados
                if (!headersObj[normalizedKey]) {
                    headersObj[normalizedKey] = value;
                }
            });
        } else {
            // Si es un objeto, normalizar las claves
            Object.entries(init.headers).forEach(([key, value]) => {
                const normalizedKey = key.toLowerCase();
                // Solo tomar el primer valor si hay duplicados
                if (!headersObj[normalizedKey]) {
                    headersObj[normalizedKey] = String(value);
                }
            });
        }
    }
    
    // Normalizar Authorization header - asegurar que solo haya uno
    // Si hay múltiples valores separados por coma, tomar solo el primero
    if (headersObj['authorization']) {
        const authValue = headersObj['authorization'];
        // Si el valor contiene comas (múltiples tokens), tomar solo el primero
        const firstAuthValue = authValue.split(',')[0].trim();
        headersObj['authorization'] = firstAuthValue;
    }
    
    // Asegurarse de que Content-Type esté configurado
    if (!headersObj['content-type']) {
        headersObj['content-type'] = 'application/json';
    }
    
    // Usar 'Authorization' con A mayúscula para el header final (estándar HTTP)
    const finalHeaders: Record<string, string> = {};
    Object.entries(headersObj).forEach(([key, value]) => {
        // Usar 'Authorization' con A mayúscula para el header de autorización
        const finalKey = key === 'authorization' ? 'Authorization' : 
                        key === 'content-type' ? 'Content-Type' : key;
        finalHeaders[finalKey] = value;
    });
    
    const headers: HeadersInit = finalHeaders;
    
    // Crear una copia de init preservando todo, especialmente el body
    const fetchInit: RequestInit = {
        method: init.method,
        headers: headers,
        body: body, // Asegurarse de que el body se pase como string
        credentials: init.credentials,
        cache: init.cache,
        redirect: init.redirect,
        referrer: init.referrer,
        referrerPolicy: init.referrerPolicy,
        integrity: init.integrity,
        keepalive: init.keepalive,
        mode: init.mode,
        signal: init.signal,
    };
    
    return fetch(url, fetchInit);
};

const httpLink = new HttpLink({ fetch: customFetch });

// Función para obtener y validar el token
const getValidToken = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const token = window.localStorage.getItem('token');
        if (!token) {
            return null;
        }

        // Validar formato del token (debe tener 3 partes separadas por puntos)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('[Apollo Client] Invalid token format');
            return null;
        }

        try {
            const decoded = JSON.parse(atob(tokenParts[1]));
            const exp = decoded.exp;
            
            if (exp && Date.now() >= exp * 1000) {
                // Token expirado, limpiarlo
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('authenticated');
                window.localStorage.removeItem('user');
                window.localStorage.removeItem('profile');
                return null;
            }
            
            return token;
        } catch (decodeError) {
            // Si el token no se puede decodificar, podría ser inválido, pero lo intentamos enviar de todas formas
            // El backend lo rechazará si es inválido
            return token;
        }
    } catch (error) {
        console.error('[Apollo Client] Error getting token from localStorage:', error);
        return null;
    }
};

// Enlace de autenticación para agregar el token a las cabeceras
const authLink = setContext((_, { headers }) => {
    const token = getValidToken();
    
    // Convertir headers a objeto plano para trabajar con ellos
    const headersObj: Record<string, string> = {};
    if (headers) {
        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                headersObj[key.toLowerCase()] = value;
            });
        } else if (Array.isArray(headers)) {
            headers.forEach(([key, value]) => {
                headersObj[key.toLowerCase()] = String(value);
            });
        } else {
            Object.entries(headers).forEach(([key, value]) => {
                headersObj[key.toLowerCase()] = String(value);
            });
        }
    }
    
    if (!token) {
        // Si no hay token, aún así devolver los headers para que la request continúe
        // El backend manejará el error de autenticación
        console.warn('[Apollo Client] No valid token found in localStorage');
        return {
            headers: headersObj,
        };
    }
    
    // Solo agregar el header Authorization si no existe ya
    // Esto previene duplicados
    if (!headersObj['authorization'] && !headersObj['Authorization']) {
        headersObj['authorization'] = `Bearer ${token}`;
        console.log('[Apollo Client] Token found, adding Authorization header');
    } else {
        console.log('[Apollo Client] Authorization header already exists, skipping');
    }
    
    return {
        headers: headersObj,
    };
});

// Configurar Apollo Client
const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
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
