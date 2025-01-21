'use client'
import { useState, useEffect } from 'react'
import ProdutoItem from '@/components/produto/ProdutoItem'
import useProdutos from '@/data/hooks/useProdutos'
import { IconArrowNarrowUp } from '@tabler/icons-react'
import { ProvedorSessao } from '@/data/contexts/ContextoSessao'
import { ProvedorUsuario } from '@/data/contexts/ContextoUsuario'

export default function Inicio() {
    const { produtos } = useProdutos()
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <ProvedorSessao>
            <ProvedorUsuario>
                <div className="container mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {produtos.map((produto) => (
                        <ProdutoItem key={produto.id} produto={produto} />
                    ))}

                    {showButton && (
                        <button
                            onClick={scrollToTop}
                            className="fixed bottom-5 right-5 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-800 transition"
                        >
                            <IconArrowNarrowUp size={18} />
                        </button>
                    )}
                </div>
            </ProvedorUsuario>
        </ProvedorSessao>
    )
}