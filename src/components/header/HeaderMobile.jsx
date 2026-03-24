import {
    Search,
    ShoppingCart,
    Sun,
    Menu,
    X,
    ArrowUp
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import LogoTexto from "../../assets/logo-texto.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../data/contexts/AuthContext";
import { useCart } from "../../data/contexts/CartContext";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const categorias = [
    "Notebooks", "Processadores", "Periféricos", "Áudio",
    "Monitores", "Placas de Vídeo", "Placas Mãe", "Memória RAM", "Video Games",
];

export default function HeaderMobile() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg text-white">
                <div className="px-2 py-3">

                    {/* TOPO */}
                    <div className="flex items-center justify-between gap-2">

                        {/* LOGO */}
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <img
                                src={Logo}
                                alt="GamerStore"
                                className="h-14 object-contain"
                            />
                            <img
                                src={LogoTexto}
                                alt="GamerStore"
                                className="h-14 w-45 object-contain"
                            />
                        </button>

                        <div className="flex items-center gap-1">

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
                                        <button className="px-3 py-2 bg-zinc-800 rounded-lg text-sm max-w-28 truncate cursor-pointer">
                                            {user.nome}
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        side="bottom"
                                        collisionPadding={8}
                                        className="bg-black text-white mr-2"
                                    >
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col">
                                                <span>{user.nome}</span>
                                                <span className="text-xs text-zinc-400">
                                                    {user.email}
                                                </span>
                                            </div>
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
                                            className="text-red-500 cursor-pointer hover:bg-zinc-800"
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
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setMenuOpen(true)}
                                className="cursor-pointer"
                            >
                                <Menu size={26} />
                            </button>
                        </div>
                    </div>

                    {/* 🔹 LINHA SEPARADORA */}
                    <div className="my-2 h-0.5 w-full bg-lime-400 rounded-full" />

                    {/* BUSCA */}
                    <div className="flex">
                        <input
                            placeholder="Buscar produtos..."
                            className="flex-1 px-4 py-2 border-b border-lime-400 bg-transparent outline-none"
                        />
                        <button className="px-3 border-b border-lime-400 cursor-pointer">
                            <Search size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* MENU LATERAL */}
            {menuOpen && (
                <>
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 bg-black/90 z-40 cursor-pointer"
                    />
                    <aside className="fixed top-0 right-0 z-50 h-screen w-72 bg-black">
                        <div className="flex justify-between p-4 border-b border-zinc-800">
                            <span className="font-bold text-white">Categorias</span>
                            <button
                                className="text-white cursor-pointer"
                                onClick={() => setMenuOpen(false)}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="flex flex-col px-3 py-2">
                            {categorias.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        const search = cat.toLowerCase();
                                        setMenuOpen(false)
                                        navigate(`/categoria/${search}`);
                                    }}
                                    className="py-2 text-left border-b border-zinc-800 text-white
                                    hover:bg-zinc-800 hover:text-lime-400 cursor-pointer"
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </aside>
                </>
            )}

            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-14 right-6 z-50 p-2 bg-white text-black rounded-md cursor-pointer"
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </>
    );
}
