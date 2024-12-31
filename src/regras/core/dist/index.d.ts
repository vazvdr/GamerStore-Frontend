interface Especificacoes {
    destaque: string;
    [chave: string]: string | number | boolean;
}

interface Precificavel {
    precoBase: number;
    precoPromocional: number;
    precoMedio: number;
    menorPreco: number;
    maiorPreco: number;
}

interface Produto extends Precificavel {
    id: number;
    nome: string;
    descricao: string;
    marca: string;
    modelo: string;
    imagem: string;
    videoReview: string;
    nota: number;
    tags: string[];
    especificacoes: Especificacoes;
}

declare const produtos: Produto[];

declare const QTDE_MAX_PARCELAS = 12;
declare const TAXA_JUROS_MENSAL = 0.0167;

interface Parcelamento {
    valorTotal: number;
    valorParcela: number;
    qtdeParcelas: number;
    taxaJuros: number;
}

declare class CalcularParcelamento {
    executar(valor: number, qtdeParcelas?: number, taxaJuros?: number): Parcelamento;
    private calcularJurosCompostos;
    private comDuasCasasDecimais;
}

declare class Moeda {
    static formatar(valor: number, localizacao?: string, moeda?: string): string;
}

export { CalcularParcelamento, type Especificacoes, Moeda, type Parcelamento, type Precificavel, type Produto, QTDE_MAX_PARCELAS, TAXA_JUROS_MENSAL, produtos };
