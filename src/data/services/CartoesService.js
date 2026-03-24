import { getToken } from "../../utils/cookies";

const BASE_URL = "http://localhost:8080/cartoes";

export async function criarCartao(data) {
    const token = getToken();

    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erro ao criar cartão");
    }

    return await response.json();
}

export async function listarCartoes() {
    const token = getToken();

    const response = await fetch(BASE_URL, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao listar cartões");
    }

    return await response.json();
}

export async function deletarCartao(id) {
    const token = getToken();

    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao deletar cartão");
    }

    return true;
}