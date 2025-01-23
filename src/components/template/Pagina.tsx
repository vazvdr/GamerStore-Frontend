"use client";
import Cabecalho from './Cabecalho'
import Rodape from './Rodape'
import { CarrinhoProvider } from '@/data/contexts/CarrinhoContext';

export interface PaginaProps {
    className?: string
    children: any
    semCabecalho?: boolean
    semRodape?: boolean
    semContainer?: boolean
    semPadding?: boolean
}

export default function Pagina(props: PaginaProps) {
    return (
        <CarrinhoProvider>
            <div
                className="flex flex-col min-h-screen text-white bg-black mt-10"
            >
                <div
                    className="flex-1 flex flex-col w-screen"
                >
                    {props.semCabecalho ? null : <Cabecalho />}
                    <main
                        className={`
                        flex-1 flex flex-col ${props.className ?? ''}
                        ${props.semContainer ? '' : 'container'}
                        ${props.semPadding ? '' : 'py-10'}
                    `}
                    >
                        {props.children}
                    </main>
                    {props.semRodape ? null : <Rodape />}
                </div>
            </div>
        </CarrinhoProvider>

    )
}
