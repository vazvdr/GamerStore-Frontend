const API_URL =
    "https://suggestionservice-gamerstore.up.railway.app";

export async function registerProductView(
    productId,
    userId = null
) {
    try {
        if (!userId) {
            const viewedProducts =
                JSON.parse(
                    localStorage.getItem(
                        "viewed_products"
                    )
                ) || [];

            // evita repetição consecutiva
            if (viewedProducts[0] !== productId) {
                const updated = [
                    productId,
                    ...viewedProducts.filter(
                        (id) => id !== productId
                    ),
                ].slice(0, 20);

                localStorage.setItem(
                    "viewed_products",
                    JSON.stringify(updated)
                );
            }

            localStorage.setItem(
                "lastViewedProductId",
                productId
            );

            // envia para backend mesmo sem login
            await fetch(
                `${API_URL}/suggestions/view`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        productId,
                    }),
                }
            );

            return;
        }

        await fetch(`${API_URL}/suggestions/view`, {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                userId,
                productId,
            }),
        });
    } catch (error) {
        console.error(
            "Erro ao registrar visualização:",
            error.message
        );
    }
}

export async function getSuggestions(
    productId
) {
    try {
        const response = await fetch(
            `${API_URL}/suggestions/product/${productId}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar sugestões"
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            "Erro ao buscar sugestões:",
            error.message
        );

        return [];
    }
}

// PEGA O ÚLTIMO PRODUTO VISUALIZADO
// PARA USUÁRIOS NÃO LOGADOS
export function getGuestSuggestionSeed() {
    const lastViewed =
        localStorage.getItem(
            "lastViewedProductId"
        );

    if (lastViewed) {
        return Number(lastViewed);
    }

    const viewedProducts =
        JSON.parse(
            localStorage.getItem(
                "viewed_products"
            )
        ) || [];

    return viewedProducts[0] || null;
}