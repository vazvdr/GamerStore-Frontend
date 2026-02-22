const API_URL = "http://localhost:8082/cart";

export async function saveCart(userId, cartItems, cartTotal, shipping = null) {
    if (!userId) return;

    if (!cartItems || cartItems.length === 0) {
        return;
    }

    const payload = {
        items: cartItems.map(item => ({
            productId: item.id,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade
        })),
        subtotal: cartTotal,
        shipping: shipping ? {
            tipoFrete: shipping.tipoFrete,
            valor: shipping.valor,
            prazo: shipping.prazo,
            cep: shipping.cep
        } : null,
        total: shipping
            ? cartTotal + Number(shipping.valor)
            : cartTotal
    };

    const response = await fetch(`${API_URL}/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Erro ao enviar carrinho");
    }

    return response.json();
}

export async function applyShipping(userId, cep, tipoFrete) {

    const response = await fetch(
        `${API_URL}/${userId}/apply-shipping`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cep,
                tipoFrete
            })
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao aplicar frete");
    }

    return response.json();
}

export async function getCart(userId) {
    if (!userId) return;

    const response = await fetch(`${API_URL}/${userId}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar carrinho");
    }

    return response.json();
}