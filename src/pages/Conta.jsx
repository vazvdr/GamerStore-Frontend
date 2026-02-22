import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { editarUsuario, deletarUsuario } from "../services/UserService";
import { criarEndereco, listarEnderecos, deletarEndereco, atualizarEndereco } from "@/services/EnderecoService";
import { getToken } from "../utils/cookies";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

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
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Conta() {
    const { user, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const [accordionValue, setAccordionValue] = useState(null);
    const [addressAccordionValue, setAddressAccordionValue] = useState(null);

    const [enderecos, setEnderecos] = useState([]);
    const [enderecoEmEdicaoId, setEnderecoEmEdicaoId] = useState(null);

    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
    });

    const [enderecoForm, setEnderecoForm] = useState({
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        principal: false,
    });

    function handleEditarEndereco(endereco) {
        setEnderecoEmEdicaoId(endereco.id);

        setEnderecoForm({
            cep: endereco.cep,
            rua: endereco.rua,
            numero: endereco.numero,
            complemento: endereco.complemento || "",
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            principal: endereco.principal,
        });

        setAddressAccordionValue("endereco");
    }


    const [loading, setLoading] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogMessage, setDialogMessage] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                nome: user.nome,
                email: user.email,
                senha: "",
            });
        }
    }, [user]);

    useEffect(() => {
        carregarEnderecos();
    }, []);

    async function carregarEnderecos() {
        try {
            const data = await listarEnderecos();
            const ordenados = [...data].sort(
                (a, b) => b.principal - a.principal
            );
            setEnderecos(ordenados);
        } catch (error) {
            console.error("Erro ao carregar endereços", error);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleEnderecoChange(e) {
        const { name, value, type, checked } = e.target;

        setEnderecoForm({
            ...enderecoForm,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    async function handleSalvarEndereco() {
        setLoading(true);

        try {
            if (enderecoEmEdicaoId) {
                // EDITAR
                await atualizarEndereco(enderecoEmEdicaoId, enderecoForm);

                setDialogType("success");
                setDialogMessage("Endereço atualizado com sucesso.");
            } else {
                // CRIAR
                await criarEndereco(enderecoForm);

                setDialogType("success");
                setDialogMessage("Endereço salvo com sucesso.");
            }

            setDialogOpen(true);

            setEnderecoForm({
                cep: "",
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
                principal: false,
            });

            setEnderecoEmEdicaoId(null);

            await carregarEnderecos();
        } catch {
            setDialogType("error");
            setDialogMessage("Erro ao salvar endereço.");
            setDialogOpen(true);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const token = getToken();
            await editarUsuario(token, {
                nome: form.nome,
                email: form.email,
                ...(form.senha && { senha: form.senha }),
            });

            setForm({ ...form, senha: "" });

            setDialogType("success");
            setDialogMessage("Dados atualizados com sucesso.");
            setDialogOpen(true);
        } catch {
            setDialogType("error");
            setDialogMessage("Erro ao atualizar dados da conta.");
            setDialogOpen(true);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        try {
            const token = getToken();
            await deletarUsuario(token);
            logout();
        } catch {
            setDialogType("error");
            setDialogMessage("Erro ao deletar conta.");
            setDialogOpen(true);
        }
    }

    async function handleDeleteEndereco(id) {
        try {
            await deletarEndereco(id);
            await carregarEnderecos();
        } catch (error) {
            setDialogType("error");
            setDialogMessage("Erro ao deletar endereço.");
            setDialogOpen(true);
        }
    }


    if (!user) {
        return <p className="pt-32 text-center text-white">Carregando...</p>;
    }

    const contaOpen = accordionValue === "conta";
    const enderecoOpen = addressAccordionValue === "endereco";

    return (
        <>
            {/* MODAL FEEDBACK */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="bg-black border border-lime-400 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dialogType === "success" ? "Sucesso" : "Erro"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dialogMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-white text-black border border-lime-400">
                            OK
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="min-h-screen bg-linear-to-r from-zinc-800 via-black to-zinc-800 pt-38 lg:pt-22 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-5xl flex flex-col gap-6">

                    {/* ACCORDIONS */}
                    <div className="flex flex-col sm:flex-row gap-0">

                        {/* CONTA */}
                        <div className="w-full sm:w-1/2">
                            <Accordion
                                type="single"
                                collapsible
                                value={accordionValue}
                                onValueChange={setAccordionValue}
                            >
                                <AccordionItem value="conta">
                                    <AccordionTrigger className="px-4 text-white sticky top-24 z-10">
                                        Dados da conta
                                    </AccordionTrigger>

                                    {!contaOpen && (
                                        <div className="px-4 pb-2 text-sm text-zinc-400">
                                            Edite seus dados ou exclua permanentemente sua conta
                                        </div>
                                    )}

                                    <AccordionContent className="px-4">
                                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>

                                            <button className="w-full bg-white text-black py-1.5 rounded">
                                                Salvar alterações
                                            </button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="w-full bg-red-600 py-2 rounded text-white"
                                                    >
                                                        Excluir minha conta
                                                    </button>
                                                </AlertDialogTrigger>

                                                <AlertDialogContent className="bg-black border border-lime-400 text-white">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Excluir conta</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Essa ação é irreversível.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleDeleteAccount}
                                                            className="bg-red-600"
                                                        >
                                                            Excluir
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </form>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <hr className="text-zinc-700" />
                        {/* ENDEREÇO */}
                        <div className="w-full sm:w-1/2 ">
                            <Accordion
                                type="single"
                                collapsible
                                value={addressAccordionValue}
                                onValueChange={setAddressAccordionValue}
                            >
                                <AccordionItem value="endereco">
                                    <AccordionTrigger className="px-4 text-white sticky top-24 z-10">
                                        Dados de endereço
                                    </AccordionTrigger>

                                    {!enderecoOpen && (
                                        <div className="px-4 pb-0 text-sm text-zinc-400">
                                            Cadastre e gerencie seus endereços de entrega
                                        </div>
                                    )}

                                    <AccordionContent className="px-4 space-y-1">
                                        <input
                                            name="cep"
                                            value={enderecoForm.cep}
                                            onChange={handleEnderecoChange}
                                            className="w-full px-3 py-2 rounded border bg-transparent text-white"
                                            placeholder="CEP"
                                        />

                                        <input
                                            name="rua"
                                            value={enderecoForm.rua}
                                            onChange={handleEnderecoChange}
                                            className="w-full px-3 py-2 rounded border bg-transparent text-white"
                                            placeholder="Rua"
                                        />

                                        <div className="flex gap-4">
                                            <input
                                                name="numero"
                                                value={enderecoForm.numero}
                                                onChange={handleEnderecoChange}
                                                className="w-1/3 px-3 py-2 rounded border bg-transparent text-white"
                                                placeholder="Número"
                                            />
                                            <input
                                                name="complemento"
                                                value={enderecoForm.complemento}
                                                onChange={handleEnderecoChange}
                                                className="w-2/3 px-3 py-2 rounded border bg-transparent text-white"
                                                placeholder="Complemento"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <input
                                                name="bairro"
                                                value={enderecoForm.bairro}
                                                onChange={handleEnderecoChange}
                                                className="w-1/2 px-3 py-2 rounded border bg-transparent text-white"
                                                placeholder="Bairro"
                                            />
                                            <input
                                                name="cidade"
                                                value={enderecoForm.cidade}
                                                onChange={handleEnderecoChange}
                                                className="w-1/2 px-3 py-2 rounded border bg-transparent text-white"
                                                placeholder="Cidade"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <input
                                                name="estado"
                                                value={enderecoForm.estado}
                                                onChange={handleEnderecoChange}
                                                className="w-1/2 px-3 py-2 rounded border bg-transparent text-white"
                                                placeholder="Estado"
                                            />

                                            <label className="flex items-center gap-2 text-sm text-zinc-300">
                                                <input
                                                    type="checkbox"
                                                    name="principal"
                                                    checked={enderecoForm.principal}
                                                    onChange={handleEnderecoChange}
                                                    className="accent-lime-400"
                                                />
                                                Endereço principal
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleSalvarEndereco}
                                            disabled={loading}
                                            className="w-full bg-white text-black py-2 rounded"
                                        >
                                            {loading
                                                ? "Salvando..."
                                                : enderecoEmEdicaoId
                                                    ? "Salvar alterações"
                                                    : "Salvar endereço"}
                                        </button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                    <hr className="text-zinc-700" />
                    <h1 className="text-white text-2xl">Endereços cadastrados</h1>

                    {/* LISTAGEM DE ENDEREÇOS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {enderecos.map((endereco) => (
                            <div
                                key={endereco.id}
                                className={`relative border rounded p-3 text-white ${endereco.principal
                                    ? "border-lime-400"
                                    : "border-zinc-600"
                                    }`}
                            >
                                {/* AÇÕES */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEditarEndereco(endereco)}
                                        className="p-1.5 rounded border border-zinc-600
                                        hover:border-lime-400 transition cursor-pointer"
                                        title="Editar endereço"
                                    >
                                        <Pencil size={16} />
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => handleDeleteEndereco(endereco.id)}
                                        className="p-1.5 rounded border border-zinc-600 
                                        hover:border-red-500 transition cursor-pointer"
                                        title="Excluir endereço"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <p className="font-semibold pr-14">
                                    {endereco.rua}, {endereco.numero}
                                    {endereco.principal && (
                                        <span className="ml-2 text-lime-400 text-xs">
                                            (Principal)
                                        </span>
                                    )}
                                </p>

                                <p className="text-sm text-zinc-300">
                                    {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                                </p>

                                <p className="text-xs text-zinc-400">
                                    CEP: {endereco.cep}
                                </p>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </>
    );
}
