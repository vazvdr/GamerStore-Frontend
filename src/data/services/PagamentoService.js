const API_URL = "http://localhost:8084/payments";

export async function confirmarPagamento({
    userId,
    amount,
    paymentMethodId,
    stripeCustomerId,
    items
}) {
    const payload = {
        userId,
        amount,
        paymentMethodId,
        stripeCustomerId,
        items
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao processar pagamento");
    }

    return await response.text();
}