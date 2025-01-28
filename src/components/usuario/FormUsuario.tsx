"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import ContextoUsuario from "@/data/contexts/ContextoUsuario";

export default function FormularioLoginCadastro() {
  const { entrar, registrar, usuario } = useContext(ContextoUsuario);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modo, setModo] = useState("login"); 
  const router = useRouter();

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();

    if (modo === "cadastro" && !nome) {
      setErro("O campo nome é obrigatório para cadastro.");
      return;
    }

    if (!email || !senha) {
      setErro("Os campos email e senha são obrigatórios.");
      return;
    }

    try {
      if (modo === "login") {
        await entrar({ email, senha });
        router.push("/");
      } else {
        await registrar({ nome, email, senha });
        setModo("login");
      }
      setErro("");
    } catch (err) {
        const error = err as Error;
        console.error('Erro:', error.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border border-purple-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center mb-4">
        {modo === "login" ? "Login" : "Cadastro"}
      </h2>

      {erro && <p className="text-red-500 text-center mb-4">{erro}</p>}

      <form onSubmit={handleSubmit}>
        {modo === "cadastro" && (
          <div className="mb-4">
            <label htmlFor="nome" className="block text-sm font-medium mb-1 ">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border border-purple-900 bg-transparent"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border border-purple-800 bg-transparent"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="senha" className="block text-sm font-medium mb-1">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-3 py-2 border rounded-md border border-purple-800 text-white bg-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-transparent border border-purple-800 text-white py-2 rounded-md hover:bg-white hover:text-black"
        >
          {modo === "login" ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {modo === "login" ? (
          <>
            Não tem uma conta?{" "}
            <button
              onClick={() => setModo("cadastro")}
              className="text-green-500 hover:underline"
            >
              Cadastre-se
            </button>
          </>
        ) : (
          <>
            Já tem uma conta?{" "}
            <button
              onClick={() => setModo("login")}
              className="text-green-500 hover:underline"
            >
              Faça login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
