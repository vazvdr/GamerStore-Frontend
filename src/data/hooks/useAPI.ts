'use client';
import { useCallback } from 'react';
import useSessao from './useSessao';

const URL_BASE = process.env.URL_BASE;

export function useAPI() {
    const { token } = useSessao();

    const httpRequest = useCallback(
        async (method: string, uri: string, body?: any): Promise<any> => {
            const path = uri.startsWith('/') ? uri : `/${uri}`;
            try {
                const response = await fetch(`${URL_BASE}${path}`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                    body: body ? JSON.stringify(body) : undefined,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Erro desconhecido');
                }

                return response.json();
            } catch (error) {
                console.error(`Erro na requisição ${method} ${path}:`, error);
                throw error;
            }
        },
        [token]
    );

    return {
        httpGet: (uri: string) => httpRequest('GET', uri),
        httpPost: (uri: string, body: any) => httpRequest('POST', uri, body),
        httpDelete: (uri: string) => httpRequest('DELETE', uri),
    };
}
