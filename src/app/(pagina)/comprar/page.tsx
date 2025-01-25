'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';

type Produto = {
    id: number;
    nome: string;
    precoPromocional: number;
};

export default function Comprar() {
    const router = useRouter();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [total, setTotal] = useState(0);
    const [parcelas, setParcelas] = useState(1);
    const [dadosCartao, setDadosCartao] = useState({
        nome: '',
        numero: '',
        validade: '',
        cvv: ''
    });
    const [mostrarAlerta, setMostrarAlerta] = useState(true);

    useEffect(() => {
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]') as Produto[];
        setProdutos(carrinho);

        const totalCalculado = carrinho.reduce((acc: number, produto: Produto) => acc + (produto.precoPromocional || 0), 0);
        setTotal(totalCalculado);
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setDadosCartao((prev) => ({ ...prev, [name]: value }));

        if (name === 'parcelas') {
            setParcelas(parseInt(value, 10));
        }
    }

    function finalizarCompra() {
        if (!dadosCartao.nome || !dadosCartao.numero || !dadosCartao.validade || !dadosCartao.cvv) {
            alert('Por favor, preencha todos os dados do cartão de crédito.');
            return;
        }

        // Limpar os itens do carrinho
        localStorage.removeItem('carrinho');
        setProdutos([]); // Atualiza o estado do carrinho para refletir a remoção

        router.push("/comprado");
    }

    return (
        <div className="bg-transparent min-h-screen p-6 relative">
            {mostrarAlerta && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg max-w-md text-center">
                        <p className="text-lg font-bold mb-4">
                            Essa loja virtual é fictícia. Não coloque seus dados reais nos campos abaixo.
                        </p>
                        <button
                            onClick={() => setMostrarAlerta(false)}
                            className="mt-4 bg-white text-red-600 font-semibold px-4 py-2 rounded hover:bg-gray-100"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <div className="shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Produtos no Carrinho:</h2>
                <ul className="divide-y divide-gray-200">
                    {produtos.map((produto) => (
                        <li key={produto.id} className="flex justify-between py-2">
                            <span>{produto.nome}</span>
                            <span>R$ {produto.precoPromocional ? produto.precoPromocional.toFixed(2) : '0.00'}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>

                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-2">Dados do Cartão de Crédito:</h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="nome"
                            placeholder="Nome no cartão"
                            value={dadosCartao.nome}
                            onChange={handleInputChange}
                            className="w-full text-white bg-transparent border border-gray-500 rounded px-3 py-2"
                        />
                        <input
                            type="text"
                            name="numero"
                            placeholder="Número do cartão"
                            value={dadosCartao.numero}
                            onChange={handleInputChange}
                            className="w-full text-white bg-transparent border border-gray-500 rounded px-3 py-2"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="validade"
                                placeholder="Validade (MM/AA)"
                                value={dadosCartao.validade}
                                onChange={handleInputChange}
                                className="w-full text-white bg-transparent border border-gray-500 rounded px-3 py-2"
                            />
                            <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                value={dadosCartao.cvv}
                                onChange={handleInputChange}
                                className="w-full text-white bg-transparent border border-gray-500 rounded px-3 py-2"
                            />
                        </div>
                        <select
                            name="parcelas"
                            value={parcelas}
                            onChange={handleInputChange}
                            className="w-full border border-gray-500 rounded text-white bg-transparent px-3 py-2"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1} className='bg-black'>
                                    {i + 1}x de R$ {(total / (i + 1)).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={finalizarCompra}
                    className="w-full mt-6 bg-transparent text-white border border-purple-900
                    py-2 rounded hover:bg-white hover:text-black"
                >
                    Finalizar Compra
                </button>
            </div>
        </div>
    );
}
