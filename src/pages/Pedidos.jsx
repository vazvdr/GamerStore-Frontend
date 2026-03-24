import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/contexts/AuthContext";
import { usePedidos } from "../data/hooks/usePedidos";
import PedidosList from "../components/pedido/PedidoList";

export default function Pedidos() {

    const { user, token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const { orders, loading } = usePedidos(user, token);

    // 🔐 PROTEÇÃO DE ROTA
    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-zinc-800 via-black to-zinc-800 text-white">
                Carregando pedidos...
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-linear-to-r from-zinc-800 via-black to-zinc-800 text-white p-6">

            <h1 className="text-3xl font-bold mb-8 mt-28 md:mt-26 lg:mt-20">
                Meus Pedidos
            </h1>

            <PedidosList orders={orders} />

        </div>
    );
}