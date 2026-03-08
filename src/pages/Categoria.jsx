import { useParams } from "react-router-dom";
import { useProducts } from "../data/hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { HoverEffect } from "../components/ui/card-hover-effect";

// Normaliza texto: minusculas + remove acentos + trim
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

export default function Categoria() {
    const { slug } = useParams();

    // Normaliza categoria da URL
    const search = normalizeText(slug.replace(/-/g, " "));

    const { data: products, loading, error } = useProducts({ search });

    if (loading) {
        return (
            <p className="min-h-screen pt-28 text-center text-zinc-300">
                Carregando produtos...
            </p>
        );
    }

    if (error) {
        return (
            <p className="min-h-screen pt-28 text-center text-red-500">
                Erro: {error}
            </p>
        );
    }

    return (
        <div
            className="
                min-h-screen min-w-screen bg-linear-to-r from-zinc-800 via-black to-zinc-800
                pt-34 md:pt-32 lg:pt-28 xl:pt-24
                pb-20 px-6
                max-w-7xl mx-auto
                text-white
            "
        >
            <h1 className="text-2xl font-bold mb-6 capitalize text-center">
                Categoria: {search}
            </h1>

            {products?.length === 0 && (
                <p className="text-zinc-300">
                    Nenhum produto encontrado para essa categoria.
                </p>
            )}

            {products?.length > 0 && (
                <HoverEffect
                    items={products}
                    renderItem={(product) => (
                        <ProductCard product={product} />
                    )}
                />
            )}
        </div>
    );
}