const API_URL = "http://localhost:8083/shipping";

export async function calcularFretePorCep(cep) {
    const response = await fetch(`${API_URL}/calcular`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cep }),
    });

    if (!response.ok) {
        const msg = await response.text();
        console.error("Erro ao calcular frete:", msg);
        throw new Error("Erro ao calcular frete");
    }

    return response.json();
}
