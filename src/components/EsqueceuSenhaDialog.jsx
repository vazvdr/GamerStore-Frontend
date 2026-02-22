import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTrigger,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { esqueceuSenha } from "@/services/UserService";

export function EsqueceuSenhaDialog() {
    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleEnviar() {
        if (!email) {
            toast.error("Informe um email válido");
            return;
        }

        try {
            setLoading(true);
            await esqueceuSenha(email);

            toast.success("Email de recuperação enviado com sucesso!");
            setOpen(false);
            setEmail("");
        } catch (error) {
            toast.error(error.message || "Erro ao enviar email");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="text-sm text-zinc-300 hover:underline cursor-pointer"
                >
                    Esqueceu sua senha?
                </button>
            </AlertDialogTrigger>

            <AlertDialogContent
                className="
                    bg-zinc-900
                    border border-lime-400
                    text-white
                "
            >
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                        Recuperação de senha
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-zinc-300">
                        Informe seu email para receber o link de redefinição de senha.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                        bg-zinc-800
                        text-white
                        border border-lime-400
                        placeholder:text-zinc-400
                        focus-visible:ring-lime-400
                    "
                />

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        className="
                            bg-transparent
                            text-zinc-300
                            border border-zinc-600
                            hover:bg-zinc-800 cursor-pointer
                        "
                    >
                        Cancelar
                    </AlertDialogCancel>

                    <Button
                        onClick={handleEnviar}
                        disabled={loading}
                        className="bg-white text-black border 
                        hover:text-white hover:bg-zinc-800 hover:border-lime-400 
                        cursor-pointer"
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
