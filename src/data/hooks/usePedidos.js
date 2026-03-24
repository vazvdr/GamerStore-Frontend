import { useEffect, useState } from "react";
import { getOrdersByUser } from "../services/PedidosService";

export function usePedidos(user, token) {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadOrders() {
            try {
                const data = await getOrdersByUser(user.id, token);
                setOrders(data);
            } catch (error) {
                console.error("Erro ao carregar pedidos", error);
            } finally {
                setLoading(false);
            }
        }

        if (user?.id) {
            loadOrders();
        }

    }, [user, token]);

    return {
        orders,
        loading
    };
}