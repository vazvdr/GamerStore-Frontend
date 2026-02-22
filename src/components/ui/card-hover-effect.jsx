import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function HoverEffect({ items, className, renderItem }) {
    let [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1",
                className
            )}
        >
            {items.map((item, idx) => (
                <div
                    key={item.id}
                    className="relative group block h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <motion.span
                        className="absolute inset-0
                        rounded-3xl bg-lime-400"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: hoveredIndex === idx ? 1 : 0,
                        }}
                        transition={{ duration: 1.3 }}
                    />

                    <div className="relative z-10 p-2 h-full">
                        {renderItem(item)}
                    </div>

                </div>
            ))}
        </div>
    );
}
