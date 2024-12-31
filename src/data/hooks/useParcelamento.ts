import { CalcularParcelamento, QTDE_MAX_PARCELAS } from '../../regras/core'

export default function useParcelamento(valor: number, quantidade: number = QTDE_MAX_PARCELAS) {
    return new CalcularParcelamento().executar(valor, quantidade)
}
