import { Trash2, CreditCard } from "lucide-react";
import { CardElement } from "@stripe/react-stripe-js";

export default function FormaPagamento({
    metodoPagamento,
    setMetodoPagamento,
    cartoes,
    loadingCartoes,
    cartaoSelecionado,
    handleSelecionarCartao,
    handleSalvarCartao,
    handleDeleteCartao,
    handleConfirmarPagamento,
    handleCardFocus
}) {

    return (
        <div className="bg-transparente border border-lime-400 p-6 rounded-xl shadow-lg space-y-6">

            <h2 className="text-xl font-semibold">
                Forma de Pagamento
            </h2>

            {/* 🔥 Opções de pagamento */}
            <div className="space-y-3">

                {/* CARTÃO */}
                <label
                    className={`flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border cursor-pointer transition
                        ${metodoPagamento === "cartao"
                            ? "border-lime-400"
                            : "border-zinc-600 hover:border-lime-400"
                        }`}
                >
                    <input
                        type="radio"
                        name="pagamento"
                        value="cartao"
                        checked={metodoPagamento === "cartao"}
                        onChange={(e) => setMetodoPagamento(e.target.value)}
                    />
                    <span>Cartão de Crédito</span>
                </label>
            </div>

            {metodoPagamento === "cartao" && (
                <div className="space-y-4 pt-4 border-t border-zinc-700">

                    {loadingCartoes ? (
                        <p className="text-zinc-400">Carregando cartões...</p>
                    ) : cartoes.length > 0 ? (

                        <div className="grid grid-cols-1 gap-4">

                            {cartoes.map((cartao) => (

                                <div
                                    key={cartao.id}
                                    onClick={() =>
                                        handleSelecionarCartao(cartao.stripePaymentMethodId)
                                    }
                                    className={`relative border rounded p-3 cursor-pointer transition
                                        ${cartaoSelecionado === cartao.stripePaymentMethodId
                                            ? "border-lime-400 bg-zinc-800"
                                            : "border-zinc-600 hover:border-lime-400"
                                        }`}
                                >
                                    <div className="absolute top-2 right-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCartao(cartao.id);
                                            }}
                                            className="p-1.5 rounded border border-zinc-600 hover:border-red-500 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CreditCard size={18} />
                                        <span className="font-semibold">
                                            {cartao.brand.toUpperCase()} •••• {cartao.last4}
                                        </span>
                                    </div>

                                </div>
                            ))}

                        </div>

                    ) : (

                        <>
                            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-600">
                                <CardElement onFocus={handleCardFocus} />
                            </div>

                            <button
                                onClick={handleSalvarCartao}
                                className="w-full bg-white text-black py-2 rounded hover:bg-lime-400 transition"
                            >
                                Salvar cartão
                            </button>
                        </>
                    )}
                </div>
            )}

            <button
                onClick={handleConfirmarPagamento}
                className="w-full border border-lime-400 p-4 rounded-lg font-semibold cursor-pointer transition
                hover:bg-lime-400 hover:text-black"
            >
                Confirmar Pagamento
            </button>

        </div>
    );
}