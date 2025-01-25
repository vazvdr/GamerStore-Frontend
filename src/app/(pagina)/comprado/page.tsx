'use client'
import React from "react";
import { useRouter } from "next/navigation";

export default function Comprado() {
    const router = useRouter();

    return (
        <div className="flex justify-center mt-[5%] min-h-screen bg-transparent text-white">
            <div className="w-[40%] bg-transparent text-white text-center">
                <h1 className="text-4xl font-bold mb-8">
                    Parabéns! Você comprou na Gam3r.Store. <br /> <br/>
                    Verifique seu email informado.
                </h1>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-purple-700 hover:bg-purple-500 text-white font-semibold text-lg rounded-lg"
                >
                    Voltar para a página inicial
                </button>
            </div>
        </div>
    );
}
