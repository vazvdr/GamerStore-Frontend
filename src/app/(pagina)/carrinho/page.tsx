'use client';
import { useState, useEffect } from 'react';
import { useCarrinho } from '@/data/contexts/CarrinhoContext';
import { Trash, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function Carrinho() {
    const { carrinho, aumentarQuantidade, diminuirQuantidade, removerDoCarrinho } = useCarrinho();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="container mx-auto px-4 sm:px-4 lg:px-8 py-6 w-full max-w-screen-md">
            <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

            {carrinho.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg">Seu carrinho está vazio!</p>
                    <Link href="/">
                        <Button className="mt-4 bg-purple-600 hover:bg-purple-800 text-white">
                            Voltar à loja
                        </Button>
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="grid gap-4">
                        {carrinho.map((produto) => (
                            <div
                                key={produto.id}
                                className="flex items-center gap-4 bg-transparent text-white 
            border border-purple-900 p-4 rounded-lg shadow-md"
                            >
                                <div className="w-20 h-20 flex-shrink-0">
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        className="w-full h-full object-cover rounded"
                                    />
                                </div>

                                <div className="flex-grow">
                                    <h2 className="text-lg font-semibold">{produto.nome}</h2>
                                    <p className="text-sm text-gray-400">{produto.descricao}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => diminuirQuantidade(produto.id)}
                                        disabled={produto.quantidade === 1}
                                        className={`p-2 rounded-full ${produto.quantidade === 1
                                                ? "bg-black cursor-not-allowed"
                                                : "bg-green-600 hover:bg-purple-800"
                                            }`}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-3">{produto.quantidade}</span>
                                    <button
                                        onClick={() => aumentarQuantidade(produto.id)}
                                        className="p-2 bg-green-600 hover:bg-purple-800 rounded-full"
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <button
                                        onClick={() => removerDoCarrinho(produto.id)}
                                        className="p-4 text-red-500 hover:text-red-700"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        {/* Botão "Continuar Comprando" */}
                        <Link href="/">
                            <button
                                className="px-4 py-2 border border-green-500 rounded-lg bg-transparent 
            text-white hover:bg-white hover:text-black hover:text-black transition"
                            >
                                Continuar Comprando
                            </button>
                        </Link>

                        {/* Botão "Finalizar Compra" */}
                        <Link href="/comprar">
                            <button
                                className="px-4 py-2 border border-purple-900 rounded-lg bg-transparent 
          text-white hover:bg-white hover:text-black hover:text-black transition"
                            >
                                Finalizar Compra
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>

    );
}
