'use client';

import React, { useState } from 'react';
import { useAPI } from '@/data/hooks/useAPI';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Alterna entre login e cadastro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const api = useAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      // Login
      const token = await api.login(email, password);
      if (token) {
        console.log("Token recebido:", token);
        // Redirecionar ou salvar token no localStorage/cookies
      } else {
        setError("Credenciais inválidas.");
      }
    } else {
      // Cadastro
      const token = await api.register(name, email, password);
      if (token) {
        console.log("Token recebido:", token);
        // Redirecionar ou salvar token no localStorage/cookies
      } else {
        setError("Erro ao se cadastrar.");
      }
    }
  };

  return (
    <div
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #000 0%, #0d001c 100%)',
      }}
      className="p-6 rounded-lg shadow-lg w-80 m-auto"
    >
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
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-white">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
          />
          {/* Link "Esqueceu sua senha?" */}
          {isLogin && (
            <p className="text-sm text-blue-400 cursor-pointer absolute right-0 mt-1">
              Esqueceu sua senha?
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-5"
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
  );
};

export default LoginPage;
