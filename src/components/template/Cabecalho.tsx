'use client'
import { useEffect, useState } from 'react';
import Logo from '../shared/Logo';
import IconeCarrinho from '../shared/IconeCarrinho';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useCarrinho } from '@/data/contexts/CarrinhoContext';

export default function Cabecalho() {
    const { carrinho } = useCarrinho();
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0);

    useEffect(() => {
        // Atualiza a quantidade de itens no carrinho
        const totalItens = carrinho.reduce((total, produto) => total + (produto.quantidade || 1), 0);
        setQuantidadeCarrinho(totalItens);
    }, [carrinho]);

    return (
        <div className="flex flex-col h-20 bg-black fixed top-0 w-full z-50">
            <div className="flex-1 container flex items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="mr-2 sm:mr-4">
                    <Logo />
                </div>

                {/* Barra de Pesquisa */}
                <div className="flex items-center gap-1 w-[60%] mx-auto mr-4">
                    <Input
                        placeholder="Pesquisar produtos, categorias..."
                        className="text-black hover:bg-black 
                        hover:text-white hover:border border-purple-800 p-2"
                    />
                    <Button
                        className="bg-white text-black hover:bg-black 
                        hover:text-white border border-purple-800 p-2"
                        aria-label="Pesquisar"
                    >
                        <Search size={20} />
                    </Button>
                </div>

                {/* Botões à Direita */}
                <div className="flex items-center">
                    <Link href="/login">
                        <Button
                            className="bg-white text-black hover:bg-black 
                            hover:text-white hover:border border-purple-800"
                        >
                            Entrar
                        </Button>
                    </Link>
                    <Link href="/carrinho">
                        {/* Sincroniza a quantidade de itens com o ícone do carrinho */}
                        <IconeCarrinho qtdeItens={quantidadeCarrinho} />
                    </Link>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-purple-600/20 via-violet-600/80 to-violet-600/20"></div>
        </div>
    );
}
