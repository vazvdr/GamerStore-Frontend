"use client";

const API_BASE_URL = process.env.URL_BASE;

export const useAPI = () => {
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao tentar fazer login. Verifique suas credenciais.");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Erro no login:", error);
      return null;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao tentar se cadastrar.");
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return null;
    }
  };

  return { login, register };
};
