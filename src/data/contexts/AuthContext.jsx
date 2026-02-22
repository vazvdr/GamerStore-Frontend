import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, cadastrar, editarUsuario, deletarUsuario } from "../services/UserService";
import { setToken, getToken, removeToken } from "../utils/cookies";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* 🔄 Carrega usuário ao iniciar, se existir token */
    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    id: decoded.sub,
                    nome: decoded.nome,
                    email: decoded.email,
                });
            } catch {
                removeToken();
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    
    async function handleLogin(email, senha) {
        const data = await loginService(email, senha);

        setToken(data.token);

        const decoded = jwtDecode(data.token);
        const userId = decoded.sub;

        const cartRaw = localStorage.getItem("cart");
        let cartLog = { items: [], total: 0 };
        if (cartRaw) {
            try {
                const parsed = JSON.parse(cartRaw);
                cartLog = {
                    items: parsed.items ?? [],
                    total: parsed.total ?? 0,
                };
            } catch {
                cartLog = { items: [], total: 0 };
            }
        }
    
        setUser({
            id: userId,
            nome: decoded.nome,
            email: decoded.email,
        });

        return {
            id: userId,
            nome: decoded.nome,
            email: decoded.email,
        };
    }

    async function handleRegister(usuario) {
        return cadastrar(usuario);
    }

    function logout() {
        removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                handleLogin,
                handleRegister,
                logout,
                loading,
                editarUsuario,
                deletarUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
