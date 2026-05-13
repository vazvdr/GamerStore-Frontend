const API_URL =
    "https://productservice-gamerstore.up.railway.app/products";

export const ProductService = {

    async getAll() {

        const response = await fetch(
            API_URL,
            {
                cache: "force-cache",
            }
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao buscar produtos"
            );
        }

        return response.json();
    },

    async getById(id) {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                cache: "force-cache"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Produto não encontrado"
            );
        }

        return response.json();
    },

    async search(query) {

        const normalizedQuery = query
            .toLowerCase()
            .trim();

        const response = await fetch(
            `${API_URL}/search?q=${encodeURIComponent(normalizedQuery)}`
        );

        if (!response.ok) {
            throw new Error(
                "Erro ao realizar busca de produtos"
            );
        }

        return response.json();
    }
};