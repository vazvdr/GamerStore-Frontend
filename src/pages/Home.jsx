import ProductCard from '../components/ProductCard';
import { useProducts } from '../data/hooks/useProducts';
import { HoverEffect } from '../components/ui/card-hover-effect';
import Carousel from '../components/Carousel';

import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';

export default function Home() {
    const { data: products, loading, error } = useProducts();

    const banners = [banner2, banner3];

    if (loading) {
        return (
            <div className="pt-20 flex justify-center items-center h-screen text-white">
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
        <main className="
            pt-24 md:pt-28 lg:pt-30 xl:pt-22
            pb-20
            min-h-screen
            bg-linear-to-r from-zinc-800 via-black to-zinc-800
            px-4 md:px-6
        ">

            {/* CARROSSEL */}
            <div className="mb-4 mt-16 md:mb-8 relative overflow-hidden">
                <Carousel
                    images={banners}
                    autoPlay
                    intervalTime={5000}
                />
            </div>

            {/* TÍTULO */}
            <div className="flex justify-center mb-4 md:mb-8">
                <h2 className="
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
                ">
                    Produtos em destaque
                </h2>
            </div>

            {/* PRODUTOS */}
            <HoverEffect
                items={products}
                renderItem={(product) => (
                    <ProductCard key={product.id} product={product} />
                )}
            />
        </main>
    );
}