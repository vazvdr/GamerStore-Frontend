const API_URL = "http://localhost:8082/cart";

// 📦 Adicionar produto ao carrinho
export async function addItemToCart(userId, product) {

    const response = await fetch(`${API_URL}/${userId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: product.id,
            nome: product.nome,
            descricao: product.descricao,
            preco: product.preco,
            quantidade: 1,
            imageUrl: product.image
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao adicionar produto ao carrinho");
    }

    return response.json();
}

// ➕ aumentar quantidade
export async function increaseItemQuantity(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "increase"
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao aumentar quantidade");
    }

    return response.json();
}

// ➖ diminuir quantidade
export async function decreaseItemQuantity(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "decrease"
        })
    });

    if (!response.ok) {
        throw new Error("Erro ao diminuir quantidade");
    }

    return response.json();
}

// ❌ remover produto do carrinho
export async function removeItemFromCart(userId, productId) {

    const response = await fetch(`${API_URL}/${userId}/items/${productId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao remover item do carrinho");
    }

    return response.json();
}

// 🧹 limpar carrinho
export async function clearCart(userId) {

    const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Erro ao limpar carrinho");
    }

    return response.json();
}

// 🚚 aplicar frete
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

// 🛒 buscar carrinho
export async function getCart(userId) {

    if (!userId) return {
        items: [],
        subtotal: 0,
        shipping: null,
        total: 0
    };

    const response = await fetch(`${API_URL}/${userId}`);

    if (!response.ok) {
        throw new Error("Erro ao buscar carrinho");
    }

    return response.json();
}