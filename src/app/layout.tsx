import type { Metadata } from 'next'
import './globals.css'
import { Montserrat } from 'next/font/google'
import { CarrinhoProvider } from '@/data/contexts/CarrinhoContext'

const font = Montserrat({
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Gam3r.store',
    description: 'A versão mais básica da loja de jogos',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR">
            <CarrinhoProvider>
                <body className={font.className}>{children}</body>
            </CarrinhoProvider>
        </html>
    )
}
