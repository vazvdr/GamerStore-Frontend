import { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";

// Normaliza texto
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// Categorias → tags do banco
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

export function useProducts({ id = null, search = null, isSearch = false } = {}) {
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
                    result = await ProductService.getById(id);

                    if (Array.isArray(result)) {
                        result = result[0] || null;
                    }

                } else if (search && isSearch) {
                    result = await ProductService.search(search);

                } else {
                    const allProducts = await ProductService.getAll();

                    if (search) {
                        const normalizedSearch = normalizeText(search);

                        const tagsToSearch =
                            categoryMap[normalizedSearch] || [normalizedSearch];

                        result = allProducts.filter(product => {
                            const productTag = normalizeText(product.tags || "");
                            return tagsToSearch.some(tag =>
                                productTag === normalizeText(tag)
                            );
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
    }, [id, search, isSearch]);

    return { data, loading, error };
}