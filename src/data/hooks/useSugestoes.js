import { useEffect, useState } from "react";

import {
    getGuestSuggestionSeed,
    getSuggestions,
} from "../services/SugestoesService";

export function useSugestoes(products) {
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] =
        useState(true);

    useEffect(() => {
        async function loadSuggestions() {
            try {
                setLoadingSuggestions(true);

                const lastViewedProductId =
                    getGuestSuggestionSeed();

                const fallbackProductId = products?.[0]?.id;

                const productIdToUse =
                    lastViewedProductId || fallbackProductId;

                if (!productIdToUse) return;

                const suggestions = await getSuggestions(
                    productIdToUse
                );

                setSuggestedProducts(suggestions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSuggestions(false);
            }
        }

        if (products?.length) {
            loadSuggestions();
        }
    }, [products]);

    return {
        suggestedProducts,
        loadingSuggestions,
    };
}