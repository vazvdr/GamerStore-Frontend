export default function ResumoPedido({
    cartItems,
    subtotal,
    backendTotal,
    freteSelecionado,
    isMobile = false
}) {

    if (cartItems.length === 0) {
        return (
            <p className="text-gray-400">
                Seu carrinho está vazio.
            </p>
        );
    }

    return (
        <div className={`${isMobile ? "lg:hidden" : "hidden lg:block w-full lg:w-96"} 
        bg-transparent border border-lime-400 p-6 rounded-xl shadow-lg space-y-6`}>

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
                        {freteSelecionado
                            ? `R$ ${freteSelecionado.valor.toFixed(2)}`
                            : "Frete não selecionado"}
                    </span>
                </div>

                <div className="flex justify-between text-lg font-bold border-t border-zinc-700 pt-2">
                    <span>Total</span>
                    <span>R$ {backendTotal.toFixed(2)}</span>
                </div>
            </div>

        </div>
    );
}