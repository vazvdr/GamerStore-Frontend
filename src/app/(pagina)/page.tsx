'use client'
import ProdutoItem from '@/components/produto/ProdutoItem'
import useProdutos from '@/data/hooks/useProdutos'

export default function Inicio() {
    const { produtos } = useProdutos()
    return (
        <div className="grid gap-5 container mx-auto p-4
                justify-items-center
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4">
            {produtos.map((produto) => (
                <ProdutoItem key={produto.id} produto={produto} />
            ))}
        </div>
    )
}
