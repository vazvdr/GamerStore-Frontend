import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { recuperarSenha } from "@/services/UserService";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RecuperarSenha() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Token inválido ou inexistente");
            navigate("/login");
        }
    }, [token, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!novaSenha) {
            toast.error("Informe a nova senha");
            return;
        }

        try {
            setLoading(true);
            await recuperarSenha(token, novaSenha);

            toast.success("Senha atualizada com sucesso!");
            navigate("/login");
        } catch (error) {
            toast.error(error.message || "Erro ao recuperar senha");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-zinc-900 via-black to-zinc-900 px-4">
            <div className="w-full max-w-md border border-lime-400 rounded-xl p-6 bg-transparent shadow-lg">
                <h1 className="text-2xl font-semibold text-center text-white mb-6">
                    Recuperar senha
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nova senha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="
                                w-full px-4 py-2 pr-10
                                bg-transparent text-white
                                border border-lime-400 rounded-md
                                outline-none
                            "
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="
                                absolute right-3 top-1/2 -translate-y-1/2
                                text-zinc-400 hover:text-white transition
                            "
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full py-2 rounded-md
                            bg-white text-black font-medium
                            hover:bg-zinc-300 transition cursor-pointer
                        "
                    >
                        {loading ? "Salvando..." : "Atualizar senha"}
                    </button>
                </form>
            </div>
        </div>
    );
}
