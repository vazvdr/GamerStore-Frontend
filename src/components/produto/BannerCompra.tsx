import { IconCreditCard, IconShoppingCart } from '@tabler/icons-react'
import { Moeda, Produto } from '@/regras/core/src'
import useParcelamento from '@/data/hooks/useParcelamento'

export interface BannerCompraProps {
    produto: Produto
}

export default function BannerCompra(props: BannerCompraProps) {
    const { produto } = props
    const parcelamento = useParcelamento(produto.precoPromocional)

    return (
        <div className="flex flex-col md:flex-row gap-5">
            {/* Preço */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-zinc-500 pb-5 md:pb-0 md:pr-5">
                <div className="line-through text-zinc-400">de R$ {produto?.precoBase}</div>
                <div className="text-2xl font-semibold">
                    <span className="text-base text-zinc-300">por</span>{' '}
                    <span className="text-emerald-500">R$ {produto?.precoPromocional}</span>{' '}
                    <span className="text-base text-zinc-300">à vista</span>
                </div>
            </div>

            {/* Parcelamento */}
            <div className="flex flex-col text-2xl font-semibold text-zinc-400 md:border-l border-zinc-500 md:pl-5">
                <span className="text-base text-zinc-300">{parcelamento.qtdeParcelas}x de</span>
                {Moeda.formatar(parcelamento.valorParcela)}{' '}
            </div>

            {/* Botões */}
            <div className="flex flex-col md:flex-row gap-3">
                <button className="button flex items-center justify-center gap-2 bg-pink-600" onClick={() => { }}>
                    <IconShoppingCart size={20} />
                    <span>Adicionar</span>
                </button>
                <button className="button flex items-center justify-center gap-2 bg-violet-700" onClick={() => { }}>
                    <IconCreditCard size={20} />
                    <span>Comprar</span>
                </button>
            </div>
        </div>
    )
}