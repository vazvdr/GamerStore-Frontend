import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getCart } from "../services/CartService";
import { useLocation } from "react-router-dom";

export default function Pagamento() {

    const { user, loading } = useAuth();
    const { cartItems } = useCart();

    const [backendTotal, setBackendTotal] = useState(0);
    const [loadingCart, setLoadingCart] = useState(true);
    const location = useLocation();
    const enderecoSelecionado = location.state?.enderecoSelecionado;
    const freteSelecionado = location.state?.freteSelecionado;

    useEffect(() => {
        async function fetchCart() {
            if (!user?.id) return;

            try {
                const data = await getCart(user.id);
                setBackendTotal(Number(data.total));
            } catch (error) {
                console.error("Erro ao buscar carrinho:", error);
            } finally {
                setLoadingCart(false);
            }
        }

        fetchCart();
    }, [user]);

    if (loading || loadingCart) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Carregando...
            </div>
        );
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
    );

    const shippingValue = backendTotal - subtotal;

    return (
        <div className="min-h-screen min-w-screen bg-linear-to-r from-zinc-900 via-black to-zinc-900 
        text-white pt-32 pb-10 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-4 md:mt-2 lg:mt-0">
                    Finalizar Pagamento
                </h1>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* COLUNA ESQUERDA */}
                    <div className="flex-1 space-y-8">

                        {/* Informações de Entrega */}
                        <div className="bg-transparent  border border-lime-400 p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold mb-4">
                                Informações de Entrega
                            </h2>

                            <div className="space-y-4">

                                {/* Email */}
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="font-medium">
                                        {user?.email || "Usuário não autenticado"}
                                    </p>
                                </div>

                                <hr className="border-zinc-700" />

                                {/* Endereço */}
                                <div>
                                    <p className="text-gray-400 text-sm">Endereço</p>
                                    <p className="font-medium">
                                        {enderecoSelecionado ? (
                                            <>
                                                {enderecoSelecionado.rua}, {enderecoSelecionado.numero}<br />
                                                {enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.uf}<br />
                                                CEP {enderecoSelecionado.cep}
                                            </>
                                        ) : (
                                            "Nenhum endereço selecionado"
                                        )}
                                    </p>
                                </div>

                                <hr className="border-zinc-700" />

                                {/* Frete */}
                                <div>
                                    <p className="text-gray-400 text-sm">Frete selecionado</p>
                                    <p className="font-medium">
                                        {freteSelecionado ? (
                                            <>
                                                {freteSelecionado.tipo} - {freteSelecionado.prazoDias} dias<br />
                                                R$ {freteSelecionado.valor.toFixed(2)}
                                            </>
                                        ) : (
                                            "Frete não selecionado"
                                        )}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* 🔽 Resumo MOBILE */}
                        <div className="bg-transparent border border-lime-400 p-6 rounded-xl shadow-lg space-y-6 lg:hidden">
                            <h2 className="text-xl font-semibold">
                                Resumo do Pedido
                            </h2>

                            {cartItems.length === 0 ? (
                                <p className="text-gray-400">Seu carrinho está vazio.</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center border-t border-zinc-700">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.nome}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.nome}</p>
                                            <p className="text-gray-400 text-sm">
                                                Qtd: {item.quantidade}
                                            </p>
                                        </div>
                                        <p className="font-semibold">
                                            R$ {(item.preco * item.quantidade).toFixed(2)}
                                        </p>
                                        
                                    </div>
                                ))
                            )}

                            <div className="border-t border-zinc-700 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>Frete</span>
                                    <span>
                                        {shippingValue > 0
                                            ? `R$ ${shippingValue.toFixed(2)}`
                                            : "R$ 0.00"}
                                    </span>
                                </div>

                                <div className="flex justify-between text-lg font-bold border-t border-zinc-700 pt-2">
                                    <span>Total</span>
                                    <span>R$ {backendTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Forma de Pagamento */}
                        <div className="bg-transparente border border-lime-400 p-6 rounded-xl shadow-lg space-y-6">
                            <h2 className="text-xl font-semibold">
                                Forma de Pagamento
                            </h2>

                            <div className="space-y-3">
                                <label className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 
                                flex items-center gap-3 p-4 bg-zinc-800 rounded-lg 
                                border border-white cursor-pointer hover:bg-zinc-700 transition">
                                    <input type="radio" name="pagamento" />
                                    <span>Cartão de Crédito</span>
                                </label>

                                <label className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 
                                flex items-center gap-3 p-4 bg-zinc-800 rounded-lg 
                                border border-zinc-300 cursor-pointer hover:bg-zinc-700 transition">
                                    <input type="radio" name="pagamento" />
                                    <span>Pix</span>
                                </label>

                                <label className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 
                                flex items-center gap-3 p-4 rounded-lg 
                                border border-zinc-400 cursor-pointer hover:bg-zinc-700 transition">
                                    <input type="radio" name="pagamento" />
                                    <span>Boleto</span>
                                </label>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-700">
                                <input
                                    type="text"
                                    placeholder="Número do cartão"
                                    className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 w-full p-3 
                                    rounded-lg border border-zinc-300 
                                    outline-none focus:ring-2 focus:ring-lime-400"
                                />

                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Validade"
                                        className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 flex-1 p-3 rounded-lg border border-zinc-300
                                        outline-none focus:ring-2 focus:ring-lime-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 flex-1 p-3 bg-zinc-800 rounded-lg border border-zinc-300
                                        outline-none focus:ring-2 focus:ring-lime-400"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Nome no cartão"
                                    className="bg-linear-to-r from-zinc-900 via-black to-zinc-900 w-full p-3 bg-zinc-800 rounded-lg border border-zinc-300 
                                    outline-none focus:ring-2 focus:ring-lime-400"
                                />
                            </div>

                            <button className="w-full bg-linear-to-r from-zinc-900 via-black to-zinc-900 border border-lime-400 
                            hover:text-lime-400 cursor-pointer transition p-4 rounded-lg font-semibold">
                                Confirmar Pagamento
                            </button>
                        </div>
                    </div>

                    {/* 🔲 Resumo LG+ */}
                    <div className="hidden lg:block w-full lg:w-96 bg-transparent border border-lime-400 
                    p-6 rounded-xl shadow-lg space-y-6 h-fit">
                        <h2 className="text-xl font-semibold">
                            Resumo do Pedido
                        </h2>

                        {cartItems.map((item, index) => (
                            <div key={item.id}>
                                <div className="flex gap-4 items-center">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.nome}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.nome}</p>
                                        <p className="text-zinc-200 text-sm">
                                            Qtd: {item.quantidade}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        R$ {(item.preco * item.quantidade).toFixed(2)}
                                    </p>
                                </div>

                                {index < cartItems.length - 1 && (
                                    <hr className="border-zinc-700 my-4" />
                                )}
                            </div>
                        ))}

                        <div className="border-t border-zinc-700 pt-4 space-y-2">
                            <div className="flex justify-between text-zinc-300">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-zinc-300">
                            <span>Frete</span>
                            <span>
                                {shippingValue > 0
                                    ? `R$ ${shippingValue.toFixed(2)}`
                                    : "R$ 0.00"}
                                </span>
                            </div>

                            <div className="flex justify-between text-lg font-bold border-t border-zinc-700 pt-2">
                                <span>Total</span>
                                <span>R$ {backendTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}