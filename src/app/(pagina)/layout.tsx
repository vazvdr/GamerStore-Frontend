import Pagina from '@/components/template/Pagina'
import { CarrinhoProvider } from '@/data/contexts/CarrinhoContext'

export default function Layout(props: any) {
    return (
        <CarrinhoProvider>
            <Pagina>
                {props.children}
            </Pagina>
        </CarrinhoProvider>
    )
}
