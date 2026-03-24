import { useState } from "react";
import { useAuth } from "../data/contexts/AuthContext";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import AccordionConta from "../components/conta/AccordionConta";
import AccordionEndereco from "../components/conta/AccordionEndereco";
import AccordionPagamento from "../components/conta/AccordionPagamento";
import ListaEnderecos from "../components/conta/ListaEnderecos";
import ListaCartoes from "../components/conta/ListaCartoes";
import FakeStoreDialog from "../components/conta/FakeStoreDialog";

import useConta from "../data/hooks/useConta";
import useEnderecos from "../data/hooks/useEnderecos";
import useCartoes from "../data/hooks/useCartoes";

export default function Conta() {

    const { user } = useAuth();

    const [accordionValue, setAccordionValue] = useState(null);
    const [addressAccordionValue, setAddressAccordionValue] = useState(null);
    const [paymentAccordionValue, setPaymentAccordionValue] = useState(null);

    const conta = useConta();
    const enderecosHook = useEnderecos(user);
    const cartoesHook = useCartoes();

    function handleEditarEndereco(endereco) {
        enderecosHook.handleEditarEndereco(endereco);
        setAddressAccordionValue("endereco");
    }

    function handleDeletarEndereco(enderecoId) {
        enderecosHook.handleDeletarEndereco(enderecoId);
    }


    if (!user) {
        return <p className="pt-32 text-center text-white">Carregando...</p>;
    }

    return (
        <>
            <AlertDialog
                open={conta.dialogOpen}
                onOpenChange={conta.setDialogOpen}
            >
                <AlertDialogContent className="bg-black border border-lime-400 text-white">

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            {conta.dialogType === "success" ? "Sucesso" : "Erro"}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {conta.dialogMessage}
                        </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                        <AlertDialogAction
                            className="bg-white text-black border border-lime-400"
                        >
                            OK
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>
            </AlertDialog>

            <div className="min-h-screen bg-linear-to-r from-zinc-800 via-black to-zinc-800 pt-38 lg:pt-22 pb-20 px-4 flex justify-center">

                <div className="w-full max-w-6xl flex flex-col gap-10">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* CONTA */}
                        <div>
                            <AccordionConta
                                form={conta.form}
                                handleChange={conta.handleChange}
                                handleSalvarDados={conta.handleSalvarDados}
                                handleDeleteAccount={conta.handleDeleteAccount}
                                accordionValue={accordionValue}
                                setAccordionValue={setAccordionValue}
                                dialogOpen={conta.dialogOpen}
                                setDialogOpen={conta.setDialogOpen}
                                dialogType={conta.dialogType}
                                dialogMessage={conta.dialogMessage}
                            />

                            <hr className="border-zinc-600 mt-3 lg:hidden" />
                        </div>

                        {/* ENDEREÇO */}
                        <div>
                            <AccordionEndereco
                                enderecoForm={enderecosHook.enderecoForm}
                                handleEnderecoChange={enderecosHook.handleEnderecoChange}
                                handleSalvarEndereco={enderecosHook.handleSalvarEndereco}
                                loading={enderecosHook.loading}
                                enderecoEmEdicaoId={enderecosHook.enderecoEmEdicaoId}
                                accordionValue={addressAccordionValue}
                                setAccordionValue={setAddressAccordionValue}
                            />

                            <hr className="border-zinc-600 mt-3 lg:hidden" />
                        </div>

                        {/* PAGAMENTO */}
                        <div>
                            <AccordionPagamento
                                handleCardFocus={cartoesHook.handleCardFocus}
                                handleSalvarCartao={cartoesHook.handleSalvarCartao}
                                accordionValue={paymentAccordionValue}
                                setAccordionValue={setPaymentAccordionValue}
                            />
                        </div>

                    </div>

                    <hr className="text-lime-400" />

                    {/* ================= LISTAGENS ================= */}
                    <div className="w-full">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            <ListaEnderecos
                                enderecos={enderecosHook.enderecos}
                                handleEditarEndereco={handleEditarEndereco}
                                handleDeletarEndereco={handleDeletarEndereco}
                            />

                            <ListaCartoes
                                cartoes={cartoesHook.cartoes}
                                handleDeleteCartao={cartoesHook.handleDeleteCartao}
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* DIALOG AVISO LOJA FICTÍCIA */}
            <FakeStoreDialog
                open={cartoesHook.showFakeStoreDialog}
                onClose={() => cartoesHook.setShowFakeStoreDialog(false)}
            />

        </>
    );
}