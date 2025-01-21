'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSessao from '../../../data/hooks/useSessao';
import useAPI from '../../../data/hooks/useAPI';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { criarSessao } = useSessao();
  const { httpPost } = useAPI();
  const router = useRouter();

  useEffect(() => {
    // Redireciona o usuário logado para a página inicial
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação de campos
    if (!email || !senha || (!isLogin && !name)) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      if (isLogin) {
        // Requisição de login
        const token = await httpPost('/usuario/login', { email, senha });
        criarSessao(token); // Cria a sessão com o token
        router.push('/'); // Redireciona para a página inicial
      } else {
        // Requisição de cadastro
        await httpPost('/usuario/registrar', { email, senha, nome: name });
        alert("Cadastro realizado com sucesso! Faça login.");
        setIsLogin(true); // Alterna para a tela de login
      }
    } catch (err) {
      console.error("Erro durante a autenticação:", err);
      setError("Erro ao realizar a operação. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="bg-black mt-6 p-6 rounded-lg shadow-lg w-80 m-auto relative">
      <div
        className="absolute inset-0 rounded-lg border-2"
        style={{
          borderImage: 'linear-gradient(45deg, #6b21a8, #3b82f6, #6b21a8) 1',
          borderImageSlice: 1,
        }}
      ></div>
      <div className="relative z-10 bg-transparent">
        <h1 className="text-xl font-bold text-white mb-2 text-center">
          {isLogin ? "Entrar" : "Cadastrar"}
        </h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
                style={{
                  background: 'transparent',
                  border: '2px solid transparent',
                  borderImage: 'linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1',
                  borderImageSlice: 1,
                }}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
              style={{
                background: 'transparent',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1',
                borderImageSlice: 1,
              }}
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-white">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
              style={{
                background: 'transparent',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1',
                borderImageSlice: 1,
              }}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full text-white px-4 py-2 rounded mt-5 hover:bg-red-200"
            style={{
              background: 'transparent',
              border: '2px solid transparent',
              borderImage: 'linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1',
              borderImageSlice: 1,
            }}
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-white">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 cursor-pointer"
          >
            {isLogin ? "Cadastre-se" : "Entre aqui"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
