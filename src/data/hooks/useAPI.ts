import { useCallback } from 'react'
import useSessao from './useSessao'

const URL_BASE = 'https://gamer-store-backend.vercel.app/'

export default function useAPI() {
    const { token } = useSessao()

    const httpGet = useCallback(
        async function (uri: string): Promise<any> {
            const path = uri.startsWith('/') ? uri : `/${uri}`;

            try {
                const resp = await fetch(`${URL_BASE}${path}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                return await extrairDados(resp);
            } catch (error) {
                console.error(`Erro ao fazer GET em ${path}:`, error);
                throw error;
            }
        },
        [token]
    );

    const httpPost = useCallback(
        async function (uri: string, body: any): Promise<any> {
            const path = uri.startsWith('/') ? uri : `/${uri}`
            const resp = await fetch(`${URL_BASE}${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })
            return extrairDados(resp)
        },
        [token]
    )

    async function httpPut(url: string, data: any, config?: RequestInit): Promise<any> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,  // Inclui o token no cabeçalho
                ...(config?.headers || {}),
            },
            body: JSON.stringify(data),
            ...config,
        });
    
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
    
        return await response.json();  // Espera a resposta como JSON
    }    

    const httpDelete = useCallback(
        async function (uri: string): Promise<any> {
            const path = uri.startsWith('/') ? uri : `/${uri}`
            const resp = await fetch(`${URL_BASE}${path}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
            return extrairDados(resp)
        },
        [token]
    )

    async function extrairDados(resp: Response) {
        let conteudo = ''
        try {
            conteudo = await resp.text()
            return JSON.parse(conteudo)
        } catch (e) {
            return conteudo
        }
    }

    return { httpGet, httpPost, httpPut, httpDelete }
}
