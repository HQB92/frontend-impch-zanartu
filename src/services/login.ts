import axios from 'axios';

export const login = async (username: string, password: string): Promise<string | null> => {
  const data = JSON.stringify({
    username,
    password,
  });

  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const loginPath = process.env.NEXT_PUBLIC_PATHLOGIN || '/auth/login';
  
  // Construir la URL completa
  const url = `${baseUrl}${loginPath}`;
  
  console.log('[Login] Attempting to login to:', url);

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    data: data,
    // En el navegador, axios no puede deshabilitar SSL, pero podemos manejar errores mejor
    validateStatus: (status: number) => status < 500, // No lanzar error para códigos 4xx
  };

  try {
    const response = await axios.request(config);
    
    // Si la respuesta tiene un código de error, lanzar un error
    if (response.status >= 400) {
      const message = response.data?.message || response.data?.error || 'Error al iniciar sesión';
      throw new Error(message);
    }
    
    return response.data.token;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Si el error es relacionado con SSL o conexión
    if (error.message && (
      error.message.includes('SSL') || 
      error.message.includes('does not support SSL') ||
      error.message.includes('network') ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK'
    )) {
      throw new Error(
        'Error de conexión con el servidor. ' +
        'Verifica que la URL del servidor sea correcta y que el servidor esté disponible. ' +
        `URL intentada: ${url}`
      );
    }
    
    // Si hay un error de respuesta del servidor, extraer el mensaje
    if (error.response) {
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Error ${error.response.status}: ${error.response.statusText}`;
      throw new Error(message);
    }
    
    // Si es un error de axios, usar el mensaje del error
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Error desconocido al iniciar sesión');
  }
};
