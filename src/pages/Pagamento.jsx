import { useLocation } from "react-router-dom";
import { useAuth } from "../data/contexts/AuthContext";
import { useCart } from "../data/contexts/CartContext";
import { usePagamento } from "../data/hooks/usePagamentos";

import InformacoesEntrega from "@/components/pagamento/InformacoesEntrega";
import ResumoPedido from "@/components/pagamento/ResumoPedido";
import FormaPagamento from "@/components/pagamento/FormaPagamento";
import DialogLojaFicticia from "@/components/pagamento/DialogLojaFicticia";

// shadcn
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Pagamento() {

    const { user, loading } = useAuth();
    const { cartItems } = useCart();
    const location = useLocation();

    const enderecoSelecionado = location.state?.endereco || null;
    const freteSelecionado = location.state?.frete || null;

    const pagamento = usePagamento(user, cartItems);

    if (loading || pagamento.loadingCart) {
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

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-10 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">
                    Finalizar Pagamento
                </h1>
                {pagamento.alert && (
                    <div className="mb-6">
                        <Alert
                            variant={
                                pagamento.alert.type === "error"
                                    ? "destructive"
                                    : "default"
                            }
                        >
                            <AlertDescription>
                                {pagamento.alert.message}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-8">
                        <InformacoesEntrega
                            user={user}
                            enderecoSelecionado={enderecoSelecionado}
                            freteSelecionado={freteSelecionado}
                        />
                        <ResumoPedido
                            cartItems={cartItems}
                            subtotal={subtotal}
                            backendTotal={pagamento.backendTotal}
                            freteSelecionado={freteSelecionado}
                            isMobile
                        />
                        <FormaPagamento
                            metodoPagamento={pagamento.metodoPagamento}
                            setMetodoPagamento={pagamento.setMetodoPagamento}
                            cartoes={pagamento.cartoes}
                            loadingCartoes={pagamento.loadingCartoes}
                            cartaoSelecionado={pagamento.cartaoSelecionado}
                            handleSelecionarCartao={pagamento.handleSelecionarCartao}
                            handleSalvarCartao={pagamento.handleSalvarCartao}
                            handleDeleteCartao={pagamento.handleDeleteCartao}
                            handleConfirmarPagamento={pagamento.handleConfirmarPagamento}
                            handleCardFocus={pagamento.handleCardFocus}
                        />
                    </div>
                    <ResumoPedido
                        cartItems={cartItems}
                        subtotal={subtotal}
                        backendTotal={pagamento.backendTotal}
                        freteSelecionado={freteSelecionado}
                    />
                </div>
            </div>

            <AlertDialog
                open={pagamento.alertDialog.open}
                onOpenChange={(open) =>
                    pagamento.setAlertDialog((prev) => ({
                        ...prev,
                        open
                    }))
                }
            >
                <AlertDialogContent className="bg-black border border-lime-400">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            {pagamento.alertDialog.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white">
                            {pagamento.alertDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="text-white cursor-pointer">
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DialogLojaFicticia
                show={pagamento.showFakeStoreDialog}
                onClose={() => pagamento.setShowFakeStoreDialog(false)}
            />

        </div>
    );
}