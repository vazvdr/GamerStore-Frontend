import { useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";

export function useProducts({
    id = null,
    search = null
} = {}) {
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

                } else if (search) {
                    result = await ProductService.search(search);

                } else {
                    result = await ProductService.getAll();
                }

                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
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
    }, [id, search]);

    return { data, loading, error };
}
