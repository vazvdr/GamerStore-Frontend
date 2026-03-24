const API_URL = "http://localhost:8080/usuarios";

export async function login(email, senha) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
        throw new Error("Credenciais inválidas");
    }

    return response.json(); // { token, usuario }
}

export async function cadastrar(usuario) {
    const response = await fetch(`${API_URL}/cadastrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    });

    if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
    }

    return response.json();
}

export async function editarUsuario(token, dadosAtualizados) {
    const response = await fetch(`${API_URL}/editar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizados),
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
    }

    return response.json();
}

export async function deletarUsuario(token) {
    const response = await fetch(`${API_URL}/deletar`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
    }
}

export async function esqueceuSenha(email) {
    const response = await fetch(`${API_URL}/esqueceu-senha`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error("Erro ao enviar email de recuperação");
    }

    return true;
}
export async function recuperarSenha(token, novaSenha) {
    const response = await fetch(`${API_URL}/recuperar-senha`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                novaSenha,
            }),
        }
    );

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Token inválido ou expirado");
    }

    return response.text();
}
