import { getToken } from "../utils/cookies";

const API_URL = "http://localhost:8080/enderecos";

export async function listarEnderecos() {
    const token = getToken();

    const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const msg = await response.text();
        console.error("Erro ao listar endereços:", msg);
        throw new Error("Erro ao listar endereços");
    }

    return response.json();
}

export async function criarEndereco(endereco) {
    const token = getToken();

    const response = await fetch(`${API_URL}/cadastrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endereco),
    });

    if (!response.ok) {
        const msg = await response.text();
        console.error("Erro ao cadastrar endereço:", msg);
        throw new Error("Erro ao cadastrar endereço");
    }

    return response.json();
}

export async function atualizarEndereco(id, endereco) {
    const token = getToken();

    const response = await fetch(`${API_URL}/editar/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(endereco),
    });

    if (!response.ok) {
        const msg = await response.text();
        console.error("Erro ao atualizar endereço:", msg);
        throw new Error("Erro ao atualizar endereço");
    }

    return response.json();
}

export async function deletarEndereco(id) {
    const token = getToken();

    const response = await fetch(`${API_URL}/deletar/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const msg = await response.text();
        console.error("Erro ao deletar endereço:", msg);
        throw new Error("Erro ao deletar endereço");
    }

    return true;
}
