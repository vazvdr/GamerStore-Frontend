import { useEffect, useState } from "react";

import { ProductService }
    from "../services/ProductService";

// Normaliza texto
function normalizeText(text = "") {

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
    "perifericos": [
        "teclado",
        "mouse",
        "headset"
    ],
    "audio": ["headset"],
    "monitores": ["monitor"],
    "placas de video": ["placa de video"],
    "placas mae": ["placa mae"],
    "memoria ram": ["memoria ram"],
    "video games": ["console"]
};

export function useProducts({
    id = null,
    search = null,
    isSearch = false,
    page = 0,
    size = 8
} = {}) {

    const [data, setData] =
        useState(null);

    const [totalPages, setTotalPages] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {

        let isMounted = true;

        async function fetchProducts() {

            try {

                setLoading(true);
                setError(null);

                let result;

                if (id) {

                    result =
                        await ProductService
                            .getById(id);

                    if (Array.isArray(result)) {
                        result =
                            result[0] || null;
                    }

                    if (isMounted) {
                        setData(result);
                    }

                } else if (
                    search &&
                    isSearch
                ) {

                    result =
                        await ProductService
                            .search(search);

                    if (isMounted) {
                        setData(result);
                    }

                    // =========================
                    // LISTAGEM COM PAGINAÇÃO
                    // NO FRONTEND
                    // =========================
                } else {

                    // Backend agora retorna ARRAY
                    const response =
                        await ProductService
                            .getAll();

                    result = Array.isArray(response)
                        ? response
                        : [];

                    if (search) {

                        const normalizedSearch =
                            normalizeText(search);

                        const tagsToSearch =
                            categoryMap[
                            normalizedSearch
                            ] || [
                                normalizedSearch
                            ];

                        result = result.filter(
                            product => {

                                const productTag =
                                    normalizeText(
                                        product.tags || ""
                                    );

                                return tagsToSearch.some(
                                    tag =>
                                        productTag ===
                                        normalizeText(tag)
                                );
                            }
                        );
                    }

                    const startIndex =
                        page * size;

                    const endIndex =
                        startIndex + size;

                    const paginatedProducts =
                        result.slice(
                            startIndex,
                            endIndex
                        );

                    if (isMounted) {

                        setData(
                            paginatedProducts
                        );

                        setTotalPages(
                            Math.ceil(
                                result.length / size
                            )
                        );
                    }
                }

            } catch (err) {

                console.error(
                    "Erro no useProducts:",
                    err
                );

                if (isMounted) {
                    setError(err.message);
                }

            } finally {

                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();

        return () => {
            isMounted = false;
        };

    }, [
        id,
        search,
        isSearch,
        page,
        size
    ]);

    return {
        data,
        totalPages,
        loading,
        error
    };
}