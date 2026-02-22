import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { HoverEffect } from '../components/ui/card-hover-effect';

export default function Home() {
    const {
        data: products,
        loading,
        error
    } = useProducts();

    if (loading) {
        return (
            <div className="pt-28 flex justify-center items-center h-screen text-white">
                Carregando produtos...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <main className="pt-34 md:pt-30 lg:pt-30 xl:pt-22 pb-20 min-h-screen bg-linear-to-r from-zinc-800 via-black to-zinc-800 p-6">
            <h1 className="text-white text-center text-2xl font-bold mb-6">
                Produtos em destaque
            </h1>

            <HoverEffect
                items={products}
                renderItem={(product) => (
                    <ProductCard key={product.id} product={product} />
                )}
            />
        </main>
    );
}
