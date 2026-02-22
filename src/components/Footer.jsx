import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import LogoTexto from "../assets/logo-texto.png";

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer
            className="w-full border-t border-zinc-300
            backdrop-blur-lg bg-linear-to-r from-zinc-800 via-black to-zinc-800 text-white"
        >
            <div
                className="
                    max-w-7xl mx-auto px-4 py-6 flex flex-col items-center justify-center gap-3"
            >
                {/* LOGO */}
                <div
                    onClick={() => navigate("/")}
                    className="
                        flex items-center gap-2
                        cursor-pointer
                        opacity-90 hover:opacity-100
                        transition
                    "
                >
                    <img
                        src={Logo}
                        alt="GamerStore"
                        className="h-10 w-auto"
                    />
                    <img
                        src={LogoTexto}
                        alt="GamerStore"
                        className="h-5 w-auto"
                    />
                </div>

                {/* TEXTO */}
                <p className="text-xs text-zinc-400 text-center">
                    © {new Date().getFullYear()} GamerStore — Todos os direitos reservados
                </p>
            </div>
        </footer>
    );
}
