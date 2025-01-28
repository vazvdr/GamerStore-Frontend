'use client';
import Logo from '../shared/Logo';
import IconeCarrinho from '../shared/IconeCarrinho';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useCarrinho } from '@/data/contexts/CarrinhoContext';

export default function Cabecalho() {
  const { quantidadeCarrinho, esvaziarCarrinho } = useCarrinho();

  const handleFinalizarCompra = () => {
    esvaziarCarrinho();
  };

  return (
    <div className="flex flex-col h-20 bg-black fixed top-0 w-full z-50">
      <div className="flex-1 container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mr-2 sm:mr-4">
          <Logo />
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex items-center gap-1 w-[50%] mx-auto mr-4">
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

        <div className="flex items-center">
          <Link href="/pedidos">
            <Button
              className="bg-transparent text-white border border-purple-900 hover:bg-white
              hover:text-black p-2 rounded-md text-sm font-medium"
              aria-label="Ver pedidos"
            >
              Meus Pedidos
            </Button>
          </Link>
          <Link href="/carrinho">
            <IconeCarrinho qtdeItens={quantidadeCarrinho} />
          </Link>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-purple-600/20 via-violet-600/80 to-violet-600/20"></div>
    </div>
  );
}
