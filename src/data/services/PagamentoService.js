const API_URL = "https://paymentservice-gamerstore.up.railway.app/payments";

export async function confirmarPagamento({
    userId,
    userEmail,
    userName,
    amount,
    paymentMethodId,
    stripeCustomerId,
    items
}) {
    const payload = {
        userId,
        userEmail,
        userName,
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