'use client'
import { createContext, useContext, useState } from 'react';
import { Produto } from '@/regras/core/src';

export interface CarrinhoItem {
    id: number;
    nome: string;
    imagem: string;
    descricao: string;
    quantidade: number;
}

interface CarrinhoContextProps {
    carrinho: CarrinhoItem[];
    adicionarAoCarrinho: (produto: Produto) => void;
    removerDoCarrinho: (produtoId: number) => void;
    aumentarQuantidade: (produtoId: number) => void;
    diminuirQuantidade: (produtoId: number) => void;
    quantidadeCarrinho: number;
}

const CarrinhoContext = createContext<CarrinhoContextProps | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
    const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

    const adicionarAoCarrinho = (produto: Produto) => {
        setCarrinho((prev) => {
            const itemExistente = prev.find((item) => item.id === produto.id);
            if (itemExistente) {
                return prev.map((item) =>
                    item.id === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            } else {
                return [
                    ...prev,
                    {
                        id: produto.id,
                        nome: produto.nome,
                        imagem: produto.imagem,
                        descricao: produto.descricao,
                        quantidade: 1,
                    },
                ];
            }
        });
    };

    const removerDoCarrinho = (produtoId: number) => {
        setCarrinho((prev) => prev.filter((item) => item.id !== produtoId));
    };

    const aumentarQuantidade = (produtoId: number) => {
        setCarrinho((prev) =>
            prev.map((item) =>
                item.id === produtoId
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            )
        );
    };

    const diminuirQuantidade = (produtoId: number) => {
        setCarrinho((prev) =>
            prev
                .map((item) =>
                    item.id === produtoId
                        ? { ...item, quantidade: item.quantidade - 1 }
                        : item
                )
                .filter((item) => item.quantidade > 0)
        );
    };

    const quantidadeCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

    return (
        <CarrinhoContext.Provider
            value={{
                carrinho,
                adicionarAoCarrinho,
                removerDoCarrinho,
                aumentarQuantidade,
                diminuirQuantidade,
                quantidadeCarrinho,
            }}
        >
            {children}
        </CarrinhoContext.Provider>
    );
}

export const useCarrinho = () => {
    const context = useContext(CarrinhoContext);
    if (!context) {
        throw new Error('useCarrinho must be used within a CarrinhoProvider');
    }
    return context;
};
