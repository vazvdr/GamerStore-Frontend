import {
    Search,
    ShoppingCart,
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
import { ProductService } from "../../data/services/ProductService";

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

    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!search.trim()) {
                setSuggestions([]);
                return;
            }

            try {
                const result = await ProductService.search(search);
                setSuggestions(result.slice(0, 5));
                setShowSuggestions(true);
            } catch (err) {
                console.error(err);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleSearch = () => {
        if (!search.trim()) return;

        navigate(`/pesquisa?q=${encodeURIComponent(search)}`);

        setSearch("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg text-white">
                <div className="px-2 py-3">

                    {/* TOPO */}
                    <div className="flex items-center justify-between gap-2">

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <img src={Logo} className="h-14 object-contain" />
                            <img src={LogoTexto} className="h-14 w-45 object-contain" />
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

                                    <DropdownMenuContent className="bg-black text-white mr-2">
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
                                            className="hover:bg-zinc-800 cursor-pointer"
                                        >
                                            Conta
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="border-b border-white" />

                                        <DropdownMenuItem
                                            onClick={() => navigate("/pedidos")}
                                            className="hover:bg-zinc-800 cursor-pointer"
                                        >
                                            Meus pedidos
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="border-b border-white" />

                                        <DropdownMenuItem
                                            className="text-red-500 hover:bg-zinc-800 cursor-pointer"
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
                                className="relative p-2"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button onClick={() => setMenuOpen(true)}>
                                <Menu size={26} />
                            </button>
                        </div>
                    </div>

                    <div className="my-2 h-0.5 w-full bg-lime-400 rounded-full" />

                    {/* 🔍 BUSCA */}
                    <div className="relative flex">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Buscar produtos..."
                            className="flex-1 px-4 py-2 border-b border-lime-400 bg-transparent outline-none"
                        />

                        <button onClick={handleSearch} className="px-3 border-b border-lime-400">
                            <Search size={18} />
                        </button>

                        {/* 🔥 AUTOCOMPLETE */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="
                                absolute top-full left-0 w-full
                                bg-black border border-zinc-700 mt-1 z-50 rounded-md
                                max-h-80 overflow-y-auto
                            ">
                                {suggestions.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            navigate(`/produto/${p.id}`);
                                            setSearch("");
                                            setSuggestions([]);
                                            setShowSuggestions(false);
                                        }}
                                        className="
                                            flex items-center gap-3
                                            px-4 py-2 cursor-pointer
                                            hover:bg-zinc-800
                                            text-sm
                                        "
                                    >
                                        {/* 🖼️ IMAGEM */}
                                        <img
                                            src={p.imageUrl || "/placeholder.png"}
                                            alt={p.name}
                                            className="w-10 h-10 object-cover rounded-md border border-zinc-700"
                                        />

                                        {/* 📝 INFO */}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="truncate font-medium">
                                                {p.name}
                                            </span>

                                            <span className="text-xs text-zinc-400 truncate">
                                                {p.description?.slice(0, 50)}...
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MENU */}
            {menuOpen && (
                <>
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="fixed inset-0 bg-black/90 z-40"
                    />
                    <aside className="fixed top-0 right-0 z-50 h-screen w-72 bg-black text-white">
                        <div className="flex justify-between p-4 border-b border-zinc-800">
                            <span>Categorias</span>
                            <button onClick={() => setMenuOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        <nav className="flex flex-col px-3 py-2">
                            {categorias.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate(`/categoria/${cat.toLowerCase()}`);
                                    }}
                                    className="py-2 text-left border-b border-zinc-800 hover:bg-zinc-800 cursor-pointer"
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </aside>
                </>
            )}

            {/* 🔝 SCROLL */}
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