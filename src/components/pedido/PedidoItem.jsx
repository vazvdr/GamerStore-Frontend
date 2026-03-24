import { Link } from "react-router-dom";

export default function PedidoItem({ item }) {

    const subtotal = Number(item.price) * item.quantity;

    return (
        <Link
            to={`/produto/${item.productId}`}
            className="
                grid grid-cols-2 md:grid-cols-4
                items-center text-center py-4
                border-b border-zinc-700
                transition-all duration-200 rounded-md
                hover:bg-linear-to-r from-zinc-800 via-black to-zinc-900
                hover:shadow-[0_0_12px_#84cc16] hover:scale-101
            "
        >

            {/* Imagem */}
            <div className="flex justify-center md:border-r border-zinc-200 px-2">
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                )}
            </div>

            {/* Nome */}
            <div className="font-semibold md:border-r border-zinc-200 px-2">
                {item.name}
            </div>

            {/* Quantidade */}
            <div className="text-zinc-400 md:border-r border-zinc-200 px-2">
                Qtd: {item.quantity}
            </div>

            {/* Subtotal do item */}
            <div className="text-zinc-400 px-2">
                R$ {subtotal.toFixed(2)}
            </div>

        </Link>
    );
}