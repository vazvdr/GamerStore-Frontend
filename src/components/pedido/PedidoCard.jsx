import PedidoItem from "./PedidoItem";

export default function PedidoCard({ order }) {

    const subtotal = Number(order.subtotal ?? 0);
    const total = Number(order.total ?? 0);
    const shipping = total - subtotal;

    return (
        <div className="bg-zinc-900 rounded-xl shadow-lg w-full p-4 border border-lime-400">

            {/* ITENS */}
            {order.items.map((item, index) => (
                <PedidoItem
                    key={index}
                    item={item}
                />
            ))}

            {/* 🔥 RESUMO DO PEDIDO */}
            <div className="mt-4 pt-4 flex items-center justify-center gap-4 text-sm">

                <div className="text-zinc-400">
                    Subtotal: R$ {subtotal.toFixed(2)}
                </div>

                <div className="w-px h-5 bg-zinc-600"></div>

                <div className="text-zinc-400">
                    Frete: R$ {shipping.toFixed(2)}
                </div>

                <div className="w-px h-5 bg-zinc-600"></div>

                <div className="text-green-400 font-bold text-lg">
                    Total: R$ {total.toFixed(2)}
                </div>

            </div>

            {/* INFO DO PEDIDO */}
            <div className="text-xs text-zinc-500 text-center mt-3">
                Pedido #{order.id || order._id} •{" "}
                {new Date(order.createdAt).toLocaleString()}
            </div>

        </div>
    );
}