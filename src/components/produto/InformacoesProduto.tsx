import { Produto } from '@/regras/core/src'
import Image from 'next/image'
import Especificacoes from './Especificacoes'

export interface InformacoesProdutoProps {
    produto: Produto
}

export default function InformacoesProduto(props: InformacoesProdutoProps) {
    const { produto } = props
    return (
        <div className="flex flex-col md:flex-row md:w-[100%] lg:flex-row lg:w-[100%] bg-violet-dark rounded-xl w-full">
            {/* Imagem do Produto */}
            <div className="relative h-96 w-[100%] md:w-[70%] 
            lg:w-[90%]">
                <Image
                    src={produto.imagem!}
                    fill
                    className="object-cover p-7"
                    alt="Imagem do Produto"
                />
            </div>

            {/* Especificações */}
            <div className="w-[100%] md:w-[100%] md:max-w-[100%] lg:w-[90%] break-words">
                <Especificacoes produto={produto} />
            </div>
        </div>
    )
}
