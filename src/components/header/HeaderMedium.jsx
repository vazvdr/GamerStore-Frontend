import {
    Search,
    ShoppingCart,
    Sun,
    ArrowUp
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import LogoTexto from "../../assets/logo-texto.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const categorias = [
    "Notebooks",
    "Processadores",
    "Periféricos",
    "Áudio",
    "Monitores",
    "Placas de Vídeo",
    "Placas Mãe",
    "Memória RAM",
    "Video Games",
];

export default function HeaderMedium() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg text-white border-b border-zinc-300">
                <div className="max-w-7xl mx-auto px-1 py-3">

                    {/* LINHA PRINCIPAL */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <img
                                src={Logo}
                                alt="GamerStore"
                                className="h-16 object-contain"
                            />
                            <img
                                src={LogoTexto}
                                alt="GamerStore"
                                className="h-16 w-60 object-contain"
                            />
                        </button>

                        <div className="flex">
                            <input
                                placeholder="Buscar produtos..."
                                className="px-4 py-2
                                border-b border-l border-lime-400
                                bg-transparent
                                rounded-bl-md
                                outline-none
                                text-sm"
                            />

                            <button
                                className="px-2
                                border-b border-lime-400
                                cursor-pointer
                                flex items-center
                            "
                            >
                                <Search size={18} />
                            </button>

                            {!user ? (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-3 py-2 bg-white text-black rounded-lg text-sm cursor-pointer"
                                >
                                    Entrar
                                </button>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="px-3 py-2 bg-zinc-800 rounded-lg 
                                        text-sm max-w-32 truncate cursor-pointer">
                                            {user.nome}
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-black text-white"
                                    >
                                        <DropdownMenuLabel className="flex flex-col">
                                            <span>{user.nome}</span>
                                            <span className="text-xs text-zinc-400">
                                                {user.email}
                                            </span>
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator className="bg-lime-400" />

                                        <DropdownMenuItem
                                            onClick={() => navigate("/conta")}
                                            className="cursor-pointer hover:bg-zinc-800"
                                        >
                                            Conta
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-white" />

                                        <DropdownMenuItem
                                            onClick={() => navigate("/pedidos")}
                                            className="cursor-pointer hover:bg-zinc-800"
                                        >
                                            Meus pedidos
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-white" />

                                        <DropdownMenuItem
                                            className="text-red-500 cursor-pointer hover:bg-zinc-900"
                                            onClick={() => {
                                                logout();
                                                navigate("/");
                                            }}
                                        >
                                            Sair
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <button
                                onClick={() => navigate("/carrinho")}
                                className="relative p-2 cursor-pointer"
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CATEGORIAS (MD < LG) */}
                    <nav className="flex justify-between mt-2 text-sm font-bold text-zinc-300">
                        {categorias.map(cat => (
                            <button
                                onClick={() => {
                                    const search = cat.toLowerCase();
                                    navigate(`/categoria/${search}`);
                                }}
                                key={cat}
                                className="hover:text-lime-400 transition whitespace-nowrap cursor-pointer"
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* 🔝 BOTÃO VOLTAR AO TOPO */}
            {showScrollTop && (
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="
                        fixed bottom-14 right-6 z-50
                        p-2 bg-white text-black
                        rounded-md cursor-pointer
                        shadow-lg
                    "
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </>
    );
}
