import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/logo.png";
import LogoTexto from "../assets/logo-texto.png";
import { EsqueceuSenhaDialog } from "@/components/EsqueceuSenhaDialog";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ nome: "", email: "", senha: "", });
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin, handleRegister, loading, error } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (isLogin) {
                await handleLogin(form.email, form.senha);
                navigate("/");
            } else {
                await handleRegister({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                });
                setIsLogin(true);
            }
        } catch (_) {
            // erro tratado no useAuth
        }
    }

    return (
        <div className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 pt-18 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-transparent border border-lime-400 p-6 rounded-xl shadow-lg">

                {/* 🔹 LOGO */}
                <div
                    className="flex items-center justify-center gap-1 mb-4 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <img
                        src={Logo}
                        alt="GamerStore Alien"
                        className="h-12 w-auto opacity-90 hover:opacity-100 transition"
                    />

                    <img
                        src={LogoTexto}
                        alt="GamerStore"
                        className="h-5 w-auto opacity-90 hover:opacity-100 transition"
                    />
                </div>

                {/* 🔹 FORM */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    {!isLogin && (
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome"
                            onChange={handleChange}
                            className="px-4 py-2 rounded-md bg-zinc-800 text-white outline-none border border-lime-400"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="px-4 py-2 rounded-md bg-transparent text-white outline-none border border-lime-400"
                    />

                    <div className="flex flex-col gap-1">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="senha"
                                placeholder="Senha"
                                onChange={handleChange}
                                className="
            w-full px-4 py-2 pr-10
            rounded-md bg-transparent text-white
            outline-none border border-lime-400
        "
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-zinc-400 hover:text-white
            transition
        "
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>


                        {/* 🔑 ESQUECEU SENHA */}
                        {isLogin && (
                            <div className="text-right">
                                <EsqueceuSenhaDialog />
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            mt-2 py-2 rounded-md
                            bg-white text-black font-medium
                            hover:bg-zinc-300 transition cursor-pointer
                        "
                    >
                        {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    {isLogin ? (
                        <>
                            Não tem conta?{" "}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="text-white hover:underline cursor-pointer"
                            >
                                Cadastre-se
                            </button>
                        </>
                    ) : (
                        <>
                            Já tem conta?{" "}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="text-white hover:underline cursor-pointer"
                            >
                                Entre
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
