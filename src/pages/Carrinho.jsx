import { useCart } from "../data/contexts/CartContext";
import { useAuth } from "../data/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import useEnderecos from "../data/hooks/useEnderecos";
import useFrete from "../data/hooks/useFrete";
import { usePagamento } from "@/data/hooks/usePagamentos";
import CartItems from "../components/carrinho/CartItems";
import CartClearButton from "../components/carrinho/CartClearButton";
import CartAddressForm from "../components/carrinho/CartAddressForm";
import CartAddresList from "../components/carrinho/CartAddressList";
import CartCepFrete from "../components/carrinho/CartCepFrete";
import CartShippingOptions from "../components/carrinho/CartShippingOptions";
import CartSummary from "../components/carrinho/CartSummary";
import CartActions from "../components/carrinho/CartActions";

export default function Carrinho() {
    const {
        cartItems,
        cartSubtotal,
        cartShipping,
        cartTotal,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        enderecos,
        enderecoSelecionado,
        setEnderecoSelecionado,
        enderecoForm,
        handleEnderecoChange,
        handleSalvarEndereco,
        handleDeletarEndereco,
        loadingEndereco
    } = useEnderecos(user);

    const {
        cep,
        setCep,
        opcoesFrete,
        loadingFrete,
        freteSelecionado,
        handleCalcularFrete,
        handleSelecionarFrete,
        selecionarEndereco
    } = useFrete(user);

    const { finalizarCompra } = usePagamento(user, location);

    if (cartItems.length === 0) {
        return (
            <div className="h-screen w-screen pt-24 flex items-center justify-center bg-black">
                <h2 className="text-xl font-semibold text-white">
                    Seu carrinho está vazio 🛒
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full pt-34 md:pt-30 lg:pt-24 pb-20 px-6 bg-linear-to-r from-zinc-800 via-black to-zinc-800 text-white">

            <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
                Carrinho de compras
            </h1>

            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <CartItems
                        cartItems={cartItems}
                        increaseQuantity={increaseQuantity}
                        decreaseQuantity={decreaseQuantity}
                        removeFromCart={removeFromCart}
                        navigate={navigate}
                        ClearCartButton={
                            <CartClearButton
                                onClearCart={clearCart}
                            />
                        }
                    />

                    {/* 📦 ENTREGA / RESUMO */}
                    <div className="w-full border border-zinc-700 rounded-lg p-5 space-y-6 h-fit">

                        {user && enderecos.length === 0 && (
                            <CartAddressForm
                                enderecoForm={enderecoForm}
                                handleEnderecoChange={handleEnderecoChange}
                                handleSalvarEndereco={handleSalvarEndereco}
                                loadingEndereco={loadingEndereco}
                            />
                        )}

                        {enderecos.length > 0 && (
                            <CartAddresList
                                enderecos={enderecos}
                                selecionarEndereco={(endereco) =>
                                    selecionarEndereco(endereco, setEnderecoSelecionado)
                                }
                                enderecoSelecionado={enderecoSelecionado}
                                handleDeletarEndereco={(id) => handleDeletarEndereco(id)}
                                loadingFrete={loadingFrete}
                            />
                        )}

                        {enderecos.length === 0 && (
                            <CartCepFrete
                                cep={cep}
                                setCep={setCep}
                                handleCalcularFrete={handleCalcularFrete}
                                loadingFrete={loadingFrete}
                            />
                        )}

                        <CartShippingOptions
                            opcoesFrete={opcoesFrete}
                            cartShipping={cartShipping}
                            handleSelecionarFrete={handleSelecionarFrete}
                        />

                        <CartSummary
                            subtotal={cartSubtotal}
                            shipping={cartShipping}
                            total={cartTotal}
                        />

                    </div>

                </div>

                <CartActions
                    navigate={navigate}
                    handleFinalizarCompra={() =>
                        finalizarCompra({
                            enderecoSelecionado,
                            freteSelecionado
                        })
                    }
                />

            </div>

        </div>
    );
}