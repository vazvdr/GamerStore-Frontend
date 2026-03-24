import PedidoCard from "./PedidoCard";

export default function PedidosList({ orders }) {

    if (!orders.length) {
        return (
            <div className="flex items-center justify-center text-center text-red-400 text-xl h-[60vh]">
                Você não tem nenhum pedido
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-6">
            {orders.map(order => (
                <PedidoCard
                    key={order.id || order._id}
                    order={order}
                />
            ))}
        </div>
    );
}