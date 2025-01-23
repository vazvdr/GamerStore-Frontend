'use client'
import { useCarrinho } from '@/data/contexts/CarrinhoContext'
import { Trash, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Carrinho() {
    const { carrinho, aumentarQuantidade, diminuirQuantidade, removerDoCarrinho } = useCarrinho()

    return (
        <div className="container mx-auto px-4 py-6">
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
                <div className="grid gap-4">
                    {carrinho.map((produto) => (
                        <div key={produto.id} className="flex flex-col gap-4">
                            {/* Informações do Produto */}
                            <div>
                                <img src={produto.imagem} alt={produto.nome} />
                                <h2>{produto.nome}</h2>
                                <p>{produto.descricao}</p>
                            </div>

                            {/* Controle de Quantidade */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => aumentarQuantidade(produto.id)} // Passa apenas o ID
                                    className="p-2 bg-black hover:bg-purple-800 rounded-full"
                                >
                                    +
                                </button>
                                <span>{produto.quantidade}</span>
                                <button
                                    onClick={() => diminuirQuantidade(produto.id)} // Passa apenas o ID
                                    className="p-2 bg-black hover:bg-purple-800 rounded-full"
                                >
                                    -
                                </button>
                            </div>

                            {/* Remover Produto */}
                            <button
                                onClick={() => removerDoCarrinho(produto.id)}
                                className="p-2 text-red-500"
                            >
                                🗑 Remover
                            </button>
                        </div>
                    ))}

                </div>
            )}

            {/* Footer com Opções */}
            {carrinho.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                    <Link href="/">
                        <Button className="bg-gray-500 hover:bg-gray-700 text-white">
                            Continuar Comprando
                        </Button>
                    </Link>
                    <Button className="bg-green-600 hover:bg-green-800 text-white">
                        Finalizar Compra
                    </Button>
                </div>
            )}
        </div>
    )
}
