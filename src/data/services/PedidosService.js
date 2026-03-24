const API_URL = "http://localhost:8085/orders";

export async function getOrdersByUser(userId, token) {

    const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar pedidos");
    }

    return response.json();
}