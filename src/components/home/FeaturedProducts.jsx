import ProductCard from "../ProductCard";
import { HoverEffect } from "../ui/card-hover-effect";

export default function FeaturedProducts({
    products,
}) {
    return (
        <>
            <div className="flex justify-center mb-4 md:mb-8">
                <h2
                    className="
                        text-2xl sm:text-3xl md:text-4xl
                        font-extrabold
                        bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400
                        bg-clip-text text-transparent
                        tracking-wide
                        text-center
                        transition-all duration-500 ease-in-out
                        hover:bg-none
                        hover:text-zinc-300
                        hover:drop-shadow-[0_0_20px_rgba(212,212,216,0.8)]
                        cursor-default
                    "
                >
                    Produtos em destaque
                </h2>
            </div>

            <HoverEffect
                items={products}
                renderItem={(product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                )}
            />
        </>
    );
}