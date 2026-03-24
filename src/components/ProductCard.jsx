import { useNavigate } from "react-router-dom";
import { useCart } from "../data/contexts/CartContext";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();

    const itemNoCarrinho = cartItems.find(
        item => item.id === product.id
    );

    const quantidadeNoCarrinho = itemNoCarrinho?.quantidade ?? 0;

    const estoqueDisponivel = Number(product.stock) || 0;

    const estoqueMaximoAtingido =
        quantidadeNoCarrinho >= estoqueDisponivel;

    return (
        <div
            onClick={() => navigate(`/produto/${product.id}`)}
            className="
                bg-zinc-900 rounded-xl shadow-md overflow-hidden
                hover:scale-[1.02] transition
                border border-lime-400 cursor-pointer
                flex flex-col min-h-100
            "
        >
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-contain bg-zinc-950 border-b border-lime-400 p-4"
            />

            <div className="p-4 text-white flex flex-col flex-1">
                <h3 className="font-semibold text-lg">{product.name}</h3>

                <p className="text-sm line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-lg">
                        R$ {product.price}
                    </span>

                    <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
                        Estoque: {estoqueDisponivel}
                    </span>
                </div>

                <button
                    disabled={estoqueMaximoAtingido}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    className={`
                        mt-auto py-2 rounded-md font-medium transition
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
    );
}
