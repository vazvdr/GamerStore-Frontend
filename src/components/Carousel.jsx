import { useState, useEffect } from 'react';

export default function Carousel({
    images = [],
    autoPlay = true,
    intervalTime = 5000,
    height = "h-[250px] md:h-[350px]"
}) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [autoPlay, intervalTime, images.length]);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrent((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    if (!images.length) return null;

    return (
        <div className="relative w-full flex justify-center mb-12">
            <div className="w-[96%] max-w-7xl relative overflow-hidden rounded-2xl shadow-2xl aspect-[1024/275]">

                {/* Slides */}
                <div
                    className="flex transition-transform duration-700 ease-in-out h-full"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${index}`}
                            className="w-full h-full object-contain flex-shrink-0"
                        />
                    ))}
                </div>

                {/* Botão esquerda */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 
                    hover:bg-black/80 text-white p-3 rounded-md cursor-pointer"
                >
                    ‹
                </button>

                {/* Botão direita */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 
                    hover:bg-black/80 text-white p-3 rounded-md cursor-pointer"
                >
                    ›
                </button>

                {/* Indicadores */}
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrent(index)}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition ${
                                current === index
                                    ? 'bg-white scale-110'
                                    : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}