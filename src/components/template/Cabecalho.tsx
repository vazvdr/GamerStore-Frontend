import Logo from '../shared/Logo'
import IconeCarrinho from '../shared/IconeCarrinho'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from '../ui/input'

export default function Cabecalho() {
    return (
        <div
            className="flex flex-col h-20"
            style={{
                background: 'linear-gradient(90deg, #000000 0%, #4B0082 100%)',
            }}
        >
            <div className="flex-1 container flex items-center justify-between">
                <Logo />
                <Input className="w-1/3 mx-auto" placeholder="Pesquisar produtos, categorias..." />
                <div className="flex items-center gap-2">
                <Link href="/login"><Button className="bg-white text-black">Entrar</Button></Link>
                    <Link href="/carrinho">
                        <IconeCarrinho qtdeItens={0} />
                    </Link>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-violet-600/20 via-violet-600/80 to-violet-600/20"></div>
        </div>
    )
}
