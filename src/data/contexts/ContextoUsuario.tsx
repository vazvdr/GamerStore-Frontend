'use client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useState } from 'react'
import { Usuario } from '../../regras/usuario'
import useSessao from '../hooks/useSessao'
import useAPI from '../hooks/useAPI'

export interface ContextoUsuarioProps {
    carregando: boolean
    usuario: Usuario | null
    token: string | null // Adicione o token aqui
    entrar: (usuario: Partial<Usuario>) => Promise<void>
    registrar: (usuario: Usuario) => Promise<void>
    alterar: (usuario: Usuario) => Promise<void>
    excluir: (usuario: Usuario) => Promise<void>
    sair: () => void
}


const ContextoUsuario = createContext<ContextoUsuarioProps>({} as any)

export function ProvedorUsuario({ children }: any) {
    const { httpPost, httpPut, httpDelete } = useAPI()
    const { carregando, usuario, criarSessao, limparSessao } = useSessao()
    const [token, setToken] = useState<string | null>(null)
    const router = useRouter()

    // Função de login
    async function entrar(usuario: Partial<Usuario>) {
        const token = await httpPost('/usuario/login', usuario)
        criarSessao(token) // Armazena o token
    }

    // Função de registrar
    async function registrar(usuario: Usuario) {
        await httpPost('/usuario/registrar', usuario)
    }

    // Função de alterar dados do usuário
    async function alterar(usuario: Usuario) {
        if (!token) {
            throw new Error('Token de autenticação não encontrado. Faça login novamente.')
        }
        await httpPut('/usuario/alterar', usuario, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    // Função de excluir conta
    async function excluir(usuario: Usuario) {
        const token = localStorage.getItem('token') 
        if (!token) {
            throw new Error('Token de autenticação não encontrado. Faça login novamente.')
        }

        await httpDelete('/usuario/excluir') 
    }

    // Função para sair da sessão
    function sair() {
        limparSessao()
        router.push('/')
    }

    return (
        <ContextoUsuario.Provider
            value={{
                carregando,
                usuario,
                token,
                entrar,
                registrar,
                alterar,
                excluir,
                sair,
            }}
        >
            {children}
        </ContextoUsuario.Provider>
    )
}

export default ContextoUsuario