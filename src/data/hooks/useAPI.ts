import { useCallback } from 'react';
import useSessao from './useSessao';

const URL_BASE = 'https://gamer-store-backend.vercel.app';

const useAPI = () => {
  const { token } = useSessao(); 

  const extrairDados = async (resp: Response): Promise<any> => {
    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.message || 'Erro desconhecido');
    }
    return resp.json();
  };

  const httpPost = useCallback(
    async (uri: string, body: any): Promise<any> => {
      const path = uri.startsWith('/') ? uri : `/${uri}`;
      const resp = await fetch(`${URL_BASE}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      return extrairDados(resp);
    },
    [token]
  );

  const httpGet = useCallback(
    async (uri: string): Promise<any> => {
      const path = uri.startsWith('/') ? uri : `/${uri}`;
      const resp = await fetch(`${URL_BASE}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return extrairDados(resp);
    },
    [token]
  );

  const httpPut = useCallback(
    async (uri: string, body: any): Promise<any> => {
      const path = uri.startsWith('/') ? uri : `/${uri}`;
      const resp = await fetch(`${URL_BASE}${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      return extrairDados(resp);
    },
    [token]
  );

  const httpDelete = useCallback(
    async (uri: string): Promise<any> => {
      const path = uri.startsWith('/') ? uri : `/${uri}`;
      const resp = await fetch(`${URL_BASE}${path}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return extrairDados(resp);
    },
    [token]
  );

  return { httpGet, httpPost, httpPut, httpDelete };
};

export default useAPI;
