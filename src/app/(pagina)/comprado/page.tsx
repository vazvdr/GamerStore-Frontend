'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Comprado() {
    const router = useRouter();

    return (
        <div className="flex items-center mt-[2%] justify-center text-white">
            <div className="w-[90%] max-w-md bg-transparent rounded-2xl border border-green-500 shadow-lg p-8 text-center">
                <h1 className="text-3xl font-extrabold mt-[2%] text-white animate-fadeIn">
                    🎉 Parabéns! <br /> Você comprou na <span className="text-purple-600">Gam3r.Store</span>! 🎮
                </h1>
                <p className="text-lg text-yellow-400 mb-8">
                    Verifique seus pedidos no botão abaixo.
                </p>
                <button
                    onClick={() => router.push("/pedidos")}
                    className="px-6 py-3 bg-transparent text-white border border-purple-900 font-semibold text-lg rounded-lg shadow-md hover:bg-green-500 hover:text-black hover:shadow-lg transition-all"
                >
                    Ir para pedidos.
                </button>
            </div>
        </div>
    );
}
