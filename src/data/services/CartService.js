const API_URL = "http://localhost:8082/cart";

export async function syncCart(userId, items) {

    if (!userId) {
        throw new Error("Usuário não informado para sincronização");
    }

    if (!Array.isArray(items) || items.length === 0) {
        return {
            items: [],
            subTotal: 0,
            shippingValue: 0,
            total: 0
        };
    }

    const response = await fetch(`${API_URL}/${userId}/sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(items)
    });

    if (!response.ok) {
        throw new Error("Erro ao sincronizar carrinho");
    }

    return response.json();
}

export async function addItemToCart(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}`, {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Erro ao adicionar produto ao carrinho");
    }

    return response.json();
}

export async function increaseItemQuantity(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}/increase`, {
        method: "PATCH"
    });

    if (!response.ok) {
        throw new Error("Erro ao aumentar quantidade");
    }

    return response.json();
}

export async function decreaseItemQuantity(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}/decrease`, {
        method: "PATCH"
    });

    if (!response.ok) {
        throw new Error("Erro ao diminuir quantidade");
    }

    return response.json();
}

export async function removeItemFromCart(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao remover item do carrinho");
    }

    return response.json();
}

export async function clearCart(userId) {

    const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao limpar carrinho");
    }

    return true;
}

export async function applyShipping(userId, cep, tipoFrete) {

    const response = await fetch(`${API_URL}/${userId}/apply-shipping`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cep,
            tipoFrete
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao aplicar frete");
    }

    return response.json();
}

export async function getCart(userId) {

    if (!userId) {
        return {
            items: [],
            subTotal: 0,
            shippingValue: 0,
            total: 0
        };
    }

    const response = await fetch(`${API_URL}/${userId}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar carrinho");
    }

    return response.json();
}