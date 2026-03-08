import { createContext, useContext, useEffect, useState } from "react";
import {
    login as loginService,
    cadastrar,
    editarUsuario,
    deletarUsuario
} from "../services/UserService";
import { setToken, getToken, removeToken } from "../../utils/cookies";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const INACTIVITY_TIME = 5 * 60 * 1000;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ===============================
    // 🔐 Verifica token ao iniciar app
    // ===============================
    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            const isExpired = decoded.exp * 1000 < Date.now();

            if (isExpired) {
                logout();
            } else {
                setUser({
                    id: decoded.sub,
                    nome: decoded.nome,
                    email: decoded.email,
                    stripeCustomerId: decoded.stripeCustomerId
                });
            }

        } catch {
            logout();
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (!user) return;

        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                logout();
            }, INACTIVITY_TIME);
        };

        // Eventos considerados como atividade
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        // Inicia contador
        resetTimer();

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
        };
    }, [user]);

    async function handleLogin(email, senha) {
        const data = await loginService(email, senha);

        setToken(data.token);

        const decoded = jwtDecode(data.token);

        setUser({
            id: decoded.sub,
            nome: decoded.nome,
            email: decoded.email,
            stripeCustomerId: decoded.stripeCustomerId
        });

        return data.usuario;
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