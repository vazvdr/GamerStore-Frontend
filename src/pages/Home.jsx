import { useState } from "react";

import Carousel from "../components/Carousel";

import FeaturedProducts from "../components/home/FeaturedProducts";
import Pagination from "../components/home/Pagination";
import SuggestedProducts from "../components/home/SuggestedProducts";

import { useProducts } from "../data/hooks/useProducts";
import { useSugestoes } from "../data/hooks/useSugestoes";

import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

export default function Home() {

    const [currentPage, setCurrentPage] =
        useState(1);

    const PRODUCTS_PER_PAGE = 8;

    const {
        data: products,
        totalPages,
        loading,
        error
    } = useProducts({
        page: currentPage - 1,
        size: PRODUCTS_PER_PAGE
    });

    const {
        suggestedProducts,
        loadingSuggestions,
    } = useSugestoes(products);

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
            <div className="flex justify-center items-center h-screen text-red-400 bg-linear-to-r from-zinc-800 via-black to-zinc-800">
                {error}
            </div>
        );
    }

    return (
        <main
            className="
                pt-24 md:pt-28 lg:pt-30 xl:pt-22
                pb-20
                min-h-screen
                bg-linear-to-r from-zinc-800 via-black to-zinc-800
                px-4 md:px-6
            "
        >
            <div className="mb-4 mt-16 md:mb-8 relative overflow-hidden">
                <Carousel
                    images={banners}
                    autoPlay
                    intervalTime={5000}
                />
            </div>

            <FeaturedProducts
                products={products}
            />

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />

            <SuggestedProducts
                products={suggestedProducts}
                loading={loadingSuggestions}
            />
        </main>
    );
}