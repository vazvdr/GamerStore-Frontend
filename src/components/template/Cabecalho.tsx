'use client';
import Logo from '../shared/Logo';
import IconeCarrinho from '../shared/IconeCarrinho';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { BsSearch } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function Cabecalho() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Verifica quando exibir o botão "Voltar ao Topo"
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Função para voltar ao topo
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className="flex flex-col"
            style={{
                background: 'linear-gradient(90deg, #000000 0%, #0d001c 100%)',
            }}
        >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex-shrink-0">
                    <Logo />
                </div>
                <div className="flex items-center ml-[3px] flex-1 max-w-[50%] md:max-w-[50%]">
                    <Input
                        className="flex-1 border border-gray-300 rounded px-4 py-2"
                        placeholder="Pesquisar produtos, categorias..."
                    />
                    <button
                        type="submit"
                        className="ml-[3px] p-2 bg-white text-black rounded hover:text-white hover:bg-black border border-gray-300"
                    >
                        <BsSearch size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-2 ml-1">
                    <Link href="/login">
                        <Button className="bg-white text-black hover:text-white hover:bg-black transition-colors duration-200">
                            Entrar
                        </Button>
                    </Link>
                    <Link href="/carrinho">
                        <IconeCarrinho qtdeItens={0} />
                    </Link>
                </div>
            </div>

            {/* Divisória */}
            <div className="h-px bg-gradient-to-r from-violet-600/20 via-violet-600/80 to-violet-600/20"></div>

            {/* Botão "Voltar ao Topo" */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="
                        fixed bottom-4 right-4 p-3 rounded-full bg-violet-600 
                        text-white shadow-lg hover:bg-violet-800 transition-all 
                    "
                >
                    <FiArrowUp size={20} />
                </button>
            )}
        </div>
    );
}
