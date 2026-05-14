import ProductCard from "../ProductCard";

export default function SuggestedProducts({
    products,
    loading,
}) {

    if (
        loading ||
        !products ||
        products.length === 0
    ) {
        return null;
    }

    return (
        <section className="mt-20">
            <div className="flex justify-center mb-8">
                <h2
                    className="
                        text-2xl sm:text-3xl md:text-4xl
                        font-extrabold
                        bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
                        bg-clip-text text-transparent
                        tracking-wide
                        text-center
                        transition-all duration-500
                        hover:text-zinc-300
                        hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]
                        cursor-default
                    "
                >
                    Sugestões para você
                </h2>
            </div>

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-6
                "
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="
                            bg-zinc-900/70
                            border border-zinc-800
                            rounded-3xl
                            backdrop-blur-md
                            transition-all duration-300
                            hover:border-cyan-400
                            hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]
                            hover:-translate-y-1
                        "
                    >
                        <ProductCard
                            product={product}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}