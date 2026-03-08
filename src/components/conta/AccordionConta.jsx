// src/components/conta/AccordionConta.jsx
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AccordionConta({
    form,
    handleChange,
    handleSalvarDados,
    handleDeleteAccount,
    accordionValue,
    setAccordionValue,
}) {

    const [showPassword, setShowPassword] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const contaOpen = accordionValue === "conta";

    return (
        <div className="w-full">

            <Accordion
                type="single"
                collapsible
                value={accordionValue}
                onValueChange={setAccordionValue}
            >

                <AccordionItem value="conta">

                    <AccordionTrigger
                        className="w-full px-4 text-white cursor-pointer flex justify-center lg:justify-between items-center text-center lg:text-left"
                    >
                        Dados da conta
                    </AccordionTrigger>

                    {!contaOpen && (
                        <div className="px-4 pb-2 text-sm text-zinc-400 text-center lg:text-left">
                            Edite seus dados ou exclua permanentemente sua conta
                        </div>
                    )}

                    <AccordionContent className="px-4">

                        <form onSubmit={handleSalvarDados} className="space-y-4">

                            <input
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded border bg-transparent text-white"
                                placeholder="Nome"
                            />

                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded border bg-transparent text-white"
                                placeholder="Email"
                            />

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded border bg-transparent text-white pr-10"
                                    placeholder="Nova senha"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>

                            </div>

                            <button className="w-full bg-white text-black py-1.5 rounded cursor-pointer">
                                Salvar alterações
                            </button>

                        </form>

                        {/* ================= DELETE ACCOUNT ================= */}

                        <AlertDialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >

                            <AlertDialogTrigger asChild>

                                <button
                                    type="button"
                                    className="w-full bg-red-600 py-2 rounded text-white cursor-pointer mt-3"
                                >
                                    Excluir minha conta
                                </button>

                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-black border border-lime-400 text-white">

                                <AlertDialogHeader>

                                    <AlertDialogTitle>
                                        Excluir conta
                                    </AlertDialogTitle>

                                    <AlertDialogDescription>
                                        Essa ação é irreversível.
                                    </AlertDialogDescription>

                                </AlertDialogHeader>

                                <AlertDialogFooter>

                                    <AlertDialogCancel>
                                        Cancelar
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-red-600"
                                    >
                                        Excluir
                                    </AlertDialogAction>

                                </AlertDialogFooter>

                            </AlertDialogContent>

                        </AlertDialog>

                    </AccordionContent>

                </AccordionItem>

            </Accordion>

        </div>
    );
}