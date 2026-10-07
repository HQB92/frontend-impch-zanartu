import axios from 'axios';

export interface SectorChurchOption {
  id: number;
  name: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL || '';
const churchesPath = process.env.NEXT_PUBLIC_PATHSECTORCHURCHES || '/auth/sector-churches';
const loginPath = process.env.NEXT_PUBLIC_PATHSECTORLOGIN || '/auth/sector-login';

const CONNECTION_ERROR = 'Error de conexión con el servidor. Intenta de nuevo en unos minutos.';

export const fetchSectorChurches = async (): Promise<SectorChurchOption[]> => {
  try {
    const response = await axios.get(`${baseUrl}${churchesPath}`, {
      headers: { Accept: 'application/json' },
    });
    return Array.isArray(response.data) ? (response.data as SectorChurchOption[]) : [];
  } catch {
    throw new Error('No se pudo cargar la lista de iglesias. Intenta de nuevo.');
  }
};

export const loginSector = async (sectorChurchId: number, password: string): Promise<string> => {
  let response;
  try {
    response = await axios.post(
      `${baseUrl}${loginPath}`,
      { sectorChurchId, password },
      {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // Un 401 no es un error de red: se lee su mensaje más abajo.
        validateStatus: (status: number) => status < 500,
      }
    );
  } catch {
    throw new Error(CONNECTION_ERROR);
  }

  const token: unknown = response.data?.token;
  if (response.status >= 400 || typeof token !== 'string' || token.length === 0) {
    throw new Error(response.data?.message || 'Credenciales inválidas');
  }
  return token;
};
