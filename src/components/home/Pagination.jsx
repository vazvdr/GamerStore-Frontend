export default function Pagination({
    totalPages,
    currentPage,
    setCurrentPage,
}) {
    return (
        <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
            {Array.from(
                { length: totalPages },
                (_, index) => {
                    const page = index + 1;

                    return (
                        <button
                            key={page}
                            onClick={() =>
                                setCurrentPage(page)
                            }
                            className={`
                                w-10 h-10 rounded-xl
                                font-bold transition-all duration-300
                                border cursor-pointer
                                ${
                                    currentPage === page
                                        ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-transparent scale-110 shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                                        : "bg-zinc-900/70 text-zinc-300 border-zinc-700 hover:border-cyan-400 hover:text-white hover:scale-105"
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                }
            )}
        </div>
    );
}