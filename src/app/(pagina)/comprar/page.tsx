'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Produto = {
    id: number;
    nome: string;
    precoPromocional: number;
    quantidade: number;
};

type Pedido = {
    data: string;
    hora: string;
    itens: Produto[];
    total: number;
    parcelas: number;
};

export default function Comprar() {
    const router = useRouter();

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [total, setTotal] = useState(0);
    const [parcelas, setParcelas] = useState(1);
    const [email, setEmail] = useState('');
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

        const totalCalculado = carrinho.reduce(
            (acc: number, produto: Produto) => acc + (produto.precoPromocional || 0) * (produto.quantidade || 1),
            0
        );
        setTotal(totalCalculado);
    }, []);

    function handleQuantidadeChange(id: number, quantidade: number) {
        const carrinhoAtualizado = produtos.map((produto) =>
            produto.id === id ? { ...produto, quantidade } : produto
        );
        setProdutos(carrinhoAtualizado);
        localStorage.setItem('carrinho', JSON.stringify(carrinhoAtualizado));

        const novoTotal = carrinhoAtualizado.reduce(
            (acc: number, produto: Produto) => acc + produto.precoPromocional * produto.quantidade,
            0
        );
        setTotal(novoTotal);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
        } else if (name === 'parcelas') {
            setParcelas(parseInt(value, 10));
        } else {
            setDadosCartao((prev) => ({ ...prev, [name]: value }));
        }
    }

    function finalizarCompra() {
        if (!email) {
            alert('Por favor, insira seu e-mail.');
            return;
        }
    
        if (!dadosCartao.nome || !dadosCartao.numero || !dadosCartao.validade || !dadosCartao.cvv) {
            alert('Por favor, preencha todos os dados do cartão de crédito.');
            return;
        }
    
        const novoPedido: Pedido = {
            data: new Date().toLocaleDateString(),
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            itens: produtos,
            total,
            parcelas, 
          };          
    
        const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos') || '[]') as Pedido[];
    
        const pedidosAtualizados = [...pedidosExistentes, novoPedido];
        localStorage.setItem('pedidos', JSON.stringify(pedidosAtualizados));
    

        localStorage.removeItem('carrinho');
        setProdutos([]);
    
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
                        <li key={produto.id} className="flex justify-between items-center py-2">
                            <div>
                                <span>{produto.nome}</span>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Quantidade:</span>
                                    <input
                                        type="number"
                                        value={produto.quantidade}
                                        min={1}
                                        onChange={(e) =>
                                            handleQuantidadeChange(produto.id, parseInt(e.target.value, 10))
                                        }
                                        className="w-16 text-white bg-transparent border border-gray-500 rounded px-2 py-1"
                                    />
                                </div>
                            </div>
                            <span>R$ {(produto.precoPromocional * produto.quantidade).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>

                <div className="mt-6">
                    <h3 className="text-md font-semibold mb-2">Dados do Cliente:</h3>
                    <input
                        type="email"
                        name="email"
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={handleInputChange}
                        className="w-full text-white bg-transparent border border-gray-500 rounded px-3 py-2 mb-4"
                    />

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
                                <option key={i + 1} value={i + 1} className="bg-black">
                                    {i + 1}x de R$ {(total / (i + 1)).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={finalizarCompra}
                    className="w-full mt-6 bg-transparent text-white border border-purple-900 py-2 rounded hover:bg-white hover:text-black"
                >
                    Finalizar Compra
                </button>
            </div>
        </div>
    );
}
