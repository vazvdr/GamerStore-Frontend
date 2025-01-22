'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import ContextoUsuario from '@/data/contexts/ContextoUsuario'

export default function FormUsuario() {
    const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [erros, setErros] = useState({
        nome: '',
        email: '',
        senha: '',
    })

    const { usuario, entrar, registrar } = useContext(ContextoUsuario)

    const params = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (usuario?.email) {
            const dest = params.get('destino') as string
            router.push(dest ? dest : '/')
        }
    }, [usuario, router, params])

    function validarFormulario() {
        const novosErros = {
            nome: '',
            email: '',
            senha: '',
        }

        if (modo === 'cadastrar') {
            if (!nome.trim()) novosErros.nome = 'O nome é obrigatório.'
        }
        if (!email.trim()) novosErros.email = 'O e-mail é obrigatório.'
        if (!senha.trim()) novosErros.senha = 'A senha é obrigatória.'

        setErros(novosErros)
        return !Object.values(novosErros).some((erro) => erro)
    }

    async function submeter() {
        console.log('Submissão iniciada, modo:', modo);
        if (!validarFormulario()) {
            console.warn('Validação do formulário falhou:', erros);
            return;
        }
    
        if (modo === 'entrar') {
            console.log('Tentando fazer login com:', { email });
            await entrar({ email, senha });
            console.log('Login concluído');
        } else {
            console.log('Tentando registrar com:', { email });
            await registrar({ nome, email, senha });
            console.log('Registro concluído');
        }
        limparFormulario();
        console.log('Formulário limpo após submissão');
    }

    function limparFormulario() {
        setNome('')
        setEmail('')
        setSenha('')
        setErros({ nome: '', email: '', senha: '' })
        setModo('entrar')
    }

    return (
        <div className="bg-black mt-6 p-6 rounded-lg shadow-lg w-80 m-auto relative">
            <div
                className="absolute inset-0 rounded-lg border-2"
                style={{
                    borderImage: "linear-gradient(45deg, #6b21a8, #3b82f6, #6b21a8) 1",
                    borderImageSlice: 1,
                }}
            ></div>
            <div className="relative z-10 bg-transparent">
                <h1 className="text-xl font-bold text-white mb-2 text-center">
                    {modo === "entrar" ? "Entrar" : "Cadastrar"}
                </h1>
                <div className="flex flex-col w-full gap-4">
                    {modo === "cadastrar" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white">Nome</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
                                style={{
                                    background: "transparent",
                                    border: "2px solid transparent",
                                    borderImage: "linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1",
                                    borderImageSlice: 1,
                                }}
                            />
                            {erros.nome && <p className="text-red-500 text-sm">{erros.nome}</p>}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu email"
                            className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
                            style={{
                                background: "transparent",
                                border: "2px solid transparent",
                                borderImage: "linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1",
                                borderImageSlice: 1,
                            }}
                        />
                        {erros.email && <p className="text-red-500 text-sm">{erros.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Sua senha"
                            className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
                            style={{
                                background: "transparent",
                                border: "2px solid transparent",
                                borderImage: "linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1",
                                borderImageSlice: 1,
                            }}
                        />
                        {erros.senha && <p className="text-red-500 text-sm">{erros.senha}</p>}
                    </div>
                    <button
                        onClick={submeter}
                        className="w-full text-white px-4 py-2 rounded mt-5 hover:bg-red-200"
                        style={{
                            background: "transparent",
                            border: "2px solid transparent",
                            borderImage: "linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1",
                            borderImageSlice: 1,
                        }}
                    >
                        {modo === "entrar" ? "Entrar" : "Cadastrar"}
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="w-full text-white px-4 py-2 rounded mt-1 bg-red-600 hover:bg-red-700"
                    >
                        Cancelar
                    </button>
                    <p className="text-sm text-center mt-4 text-white">
                        {modo === "entrar" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                        <span
                            onClick={() => setModo(modo === "entrar" ? "cadastrar" : "entrar")}
                            className="text-blue-400 cursor-pointer"
                        >
                            {modo === "entrar" ? "Cadastre-se" : "Entre aqui"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
