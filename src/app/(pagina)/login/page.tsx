'use client';

import React, { useState } from 'react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Apenas um placeholder para o submit
    console.log(`${isLogin ? "Login" : "Cadastro"} realizado com sucesso!`);
  };

  return (
    <div
      className="bg-black p-6 rounded-lg shadow-lg w-80 m-auto relative"
    >
      {/* Gradiente de Borda */}
      <div className="absolute inset-0 rounded-lg border-2"
        style={{
          borderImage: 'linear-gradient(45deg, #6b21a8, #3b82f6, #6b21a8) 1',
          borderImageSlice: 1,
        }}
      ></div>

      {/* Conteúdo do Formulário */}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full border border-gray-500 rounded px-3 py-2 mt-1 bg-transparent text-white"
              style={{
                background: 'transparent',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(45deg, #7e22ce, #3b82f6, #7e22ce) 1',
                borderImageSlice: 1,
              }}
            />
            {/* Link "Esqueceu sua senha?" */}
            {isLogin && (
              <p className="text-sm text-white cursor-pointer absolute right-0 mt-1">
                Esqueceu sua senha?
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full text-white px-4 py-2 rounded mt-5 hover:bg-purple-900"
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
