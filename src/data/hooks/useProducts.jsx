import { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";

// Normaliza texto: minusculas + remove acentos + trim
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// Mapeamento das categorias do header → tags reais do banco
const categoryMap = {
    "notebooks": ["notebook"],
    "processadores": ["processador"],
    "perifericos": ["teclado", "mouse", "headset"],
    "audio": ["headset"],
    "monitores": ["monitor"],
    "placas de video": ["placa de video"],
    "placas mae": ["placa mae"],
    "memoria ram": ["memoria ram"],
    "video games": ["console"]
};

export function useProducts({ id = null, search = null } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchProducts() {
            try {
                setLoading(true);
                setError(null);

                let result;

                if (id) {
                    // Busca por ID
                    result = await ProductService.getById(id);

                    // Caso backend retorne array, pega o primeiro item
                    if (Array.isArray(result)) {
                        result = result[0] || null;
                    }
                } else {
                    const allProducts = await ProductService.getAll();

                    if (search) {
                        const normalizedSearch = normalizeText(search);

                        // Obtém as tags mapeadas da categoria
                        const tagsToSearch = categoryMap[normalizedSearch] || [normalizedSearch];

                        // Filtra produtos comparando tags normalizadas
                        result = allProducts.filter(product => {
                            const productTag = normalizeText(product.tags || "");
                            return tagsToSearch.some(tag => productTag === normalizeText(tag));
                        });
                    } else {
                        result = allProducts;
                    }
                }

                if (isMounted) setData(result);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [id, search]);

    return { data, loading, error };
}