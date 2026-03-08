import { useParams } from "react-router-dom";
import { useProducts } from "../data/hooks/useProducts";
import { useCart } from "../data/contexts/CartContext";

export default function Produto() {
    const { id } = useParams();

    // 🔥 Hook único (produto por ID)
    const {
        data: product,
        loading,
        error
    } = useProducts({ id });

    const { addToCart, cartItems } = useCart();

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Carregando produto...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Produto não encontrado
            </div>
        );
    }

    const itemNoCarrinho = cartItems.find(
        item => item.id === product.id
    );

    const quantidadeNoCarrinho = itemNoCarrinho?.quantidade ?? 0;

    const estoqueDisponivel =
        Number(product.quantity ?? product.stock) || 0;

    const estoqueMaximoAtingido =
        quantidadeNoCarrinho >= estoqueDisponivel;

    return (
        <div className="min-h-screen min-w-screen bg-linear-to-r from-zinc-900 via-black to-zinc-900 text-white pt-36 pb-20 px-6">

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* 🖼 IMAGEM */}
                <div className="bg-transparent border border-lime-400 rounded-xl p-6 flex items-center justify-center">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-60 object-contain"
                    />
                </div>

                {/* 📄 INFORMAÇÕES */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-zinc-400">
                        {product.description}
                    </p>

                    <div className="flex gap-4 text-sm text-zinc-300">
                        <span>
                            Marca: <strong>{product.brand}</strong>
                        </span>
                        <span>
                            Modelo: <strong>{product.model}</strong>
                        </span>
                    </div>

                    <span className="text-3xl font-bold text-emerald-400">
                        R$ {Number(product.price).toFixed(2)}
                    </span>

                    <span className="text-sm text-zinc-400">
                        Estoque disponível: {estoqueDisponivel}
                    </span>

                    <button
                        disabled={estoqueMaximoAtingido}
                        onClick={() => addToCart(product)}
                        className={`mt-4 w-fit px-6 py-3 rounded-lg font-medium transition
                            ${estoqueMaximoAtingido
                                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                                : "bg-white text-black hover:bg-zinc-300 cursor-pointer"
                            }
                        `}
                    >
                        {estoqueMaximoAtingido
                            ? "Estoque máximo"
                            : "Adicionar ao carrinho"}
                    </button>
                </div>
            </div>

            {/* 📋 ESPECIFICAÇÕES */}
            {product.specifications && (
                <div className="max-w-6xl mx-auto mt-12 bg-zinc-900 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Especificações
                    </h2>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-300">
                        {Object.entries(
                            typeof product.specifications === "string"
                                ? JSON.parse(product.specifications)
                                : product.specifications
                        ).map(([key, value]) => (
                            <li
                                key={key}
                                className="flex justify-between border-b border-zinc-700 pb-1"
                            >
                                <span>{key}</span>
                                <span className="text-zinc-400">{value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
