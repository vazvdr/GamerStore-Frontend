import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { calcularFretePorCep } from "@/services/ShippingService";
import { applyShipping } from "@/services/CartService";
import { criarEndereco, listarEnderecos, deletarEndereco } from "@/services/EnderecoService";
import { Trash2 } from "lucide-react";

export default function Carrinho() {
    const {
        cartItems,
        cartTotal,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
    } = useCart();

    const { user } = useAuth();
    const navigate = useNavigate();

    // 📦 Endereços
    const [enderecos, setEnderecos] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    // 📝 Formulário de endereço (usuário logado sem endereço)
    const [enderecoForm, setEnderecoForm] = useState({
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        principal: true
    });

    const [loadingEndereco, setLoadingEndereco] = useState(false);

    // 📦 Frete
    const [cep, setCep] = useState("");
    const [opcoesFrete, setOpcoesFrete] = useState([]);
    const [freteSelecionado, setFreteSelecionado] = useState(null);
    const [loadingFrete, setLoadingFrete] = useState(false);

    // 🔄 Carregar endereços do usuário
    useEffect(() => {
        if (!user) return

        async function carregarEnderecos() {
            try {
                const data = await listarEnderecos();
                setEnderecos(data);
            } catch (error) {
                console.error("Erro ao listar endereços", error);
            }
        }

        carregarEnderecos();
    }, [user]);

    async function calcularFreteAutomatico(cepEndereco) {
        try {
            setLoadingFrete(true);
            const response = await calcularFretePorCep(cepEndereco);
            setOpcoesFrete(response.opcoes || []);
            setFreteSelecionado(null);
        } catch (error) {
            console.error("Erro ao calcular frete", error);
        } finally {
            setLoadingFrete(false);
        }
    }

    async function handleCalcularFrete() {
        if (!cep || cep.length < 8) return;

        calcularFreteAutomatico(cep);
    }

    function selecionarEndereco(endereco) {
        if (loadingFrete) return;

        setEnderecoSelecionado(endereco);
        setCep(endereco.cep);

        setOpcoesFrete([]);
        setFreteSelecionado(null);

        calcularFreteAutomatico(endereco.cep);
    }

    function handleEnderecoChange(e) {
        const { name, value, type, checked } = e.target;

        setEnderecoForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSalvarEndereco() {
        if (!enderecoForm.cep || !enderecoForm.rua || !enderecoForm.numero) {
            alert("Preencha os campos obrigatórios (CEP, Rua e Número)");
            return;
        }

        try {
            setLoadingEndereco(true);

            await criarEndereco(enderecoForm);

            // Recarrega endereços
            const data = await listarEnderecos();
            setEnderecos(data);

            // Limpa formulário
            setEnderecoForm({
                cep: "",
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
                principal: true
            });
        } catch (error) {
            console.error("Erro ao salvar endereço", error);
            alert("Erro ao salvar endereço");
        } finally {
            setLoadingEndereco(false);
        }
    }

    async function handleDeletarEndereco(e, enderecoId) {
        e.stopPropagation();

        try {
            await deletarEndereco(enderecoId);

            setEnderecos(prev =>
                prev.filter(end => end.id !== enderecoId)
            );

            if (enderecoSelecionado?.id === enderecoId) {
                setEnderecoSelecionado(null);
                setCep("");
                setOpcoesFrete([]);
                setFreteSelecionado(null);
            }
        } catch (error) {
            console.error("Erro ao deletar endereço", error);
        }
    }

    async function handleSelecionarFrete(opcao) {
        if (!user) {
            console.warn("Usuário não logado, não é possível aplicar frete no backend");
            return;
        }

        try {
            const updatedCart = await applyShipping(user.id, cep, opcao.tipo);
            setFreteSelecionado(opcao);
        } catch (error) {
            console.error("Erro ao aplicar frete:", error);
        }
    }

    function handleFinalizarCompra() {
        if (!freteSelecionado) {
            alert("Informe seu CEP e selecione uma opção de frete!");
            return;
        }

        if (!user) {
            navigate("/login");
            return;
        }

        navigate("/pagamento", {
            state: {
                enderecoSelecionado,
                freteSelecionado
            }
        });
    }

    const valorFrete = freteSelecionado?.valor || 0;

    // 🛒 Carrinho vazio
    if (cartItems.length === 0) {
        return (
            <div className="h-screen w-screen pt-24 flex items-center justify-center bg-black">
                <h2 className="text-xl font-semibold text-white">
                    Seu carrinho está vazio 🛒
                </h2>
            </div>
        );
    }

    const usuarioLogadoSemEndereco = user && enderecos.length === 0;

    return (
        <div className="min-h-screen w-full pt-34 md:pt-30 lg:pt-24 pb-20 px-6 bg-linear-to-r from-zinc-800 via-black to-zinc-800 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
                Carrinho de compras
            </h1>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* 🛒 ITENS */}
                    <div className="w-full space-y-4">
                        <ul className="space-y-4">
                            {cartItems.map(produto => (
                                <li
                                    key={produto.id}
                                    className="
                                        grid grid-cols-[1fr_auto]
                                        md:flex md:items-center md:justify-between
                                        border border-lime-400 p-4 rounded-lg gap-4
                                        transition-all hover:bg-zinc-900/60
                                        hover:shadow-[0_0_35px_rgba(163,230,53,0.4)]
                                    "
                                >
                                    <div
                                        className="flex items-start gap-4 cursor-pointer"
                                        onClick={() => navigate(`/produto/${produto.id}`)}
                                    >
                                        <img
                                            src={produto.imageUrl}
                                            alt={produto.nome}
                                            className="w-20 h-20 object-contain bg-zinc-900 p-2 rounded"
                                        />

                                        <div>
                                            <p className="font-semibold">{produto.nome}</p>
                                            <p className="text-xs text-zinc-400 line-clamp-2">
                                                {produto.descricao}
                                            </p>
                                            <p className="text-sm mt-1">
                                                R$ {produto.preco.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-4">
                                        <button
                                            onClick={() => increaseQuantity(produto.id)}
                                            disabled={produto.quantidade >= produto.estoque}
                                            className={`px-2 rounded border border-lime-400 cursor-pointer
                                                ${produto.quantidade >= produto.estoque
                                                    ? "bg-zinc-700 opacity-50"
                                                    : "bg-zinc-800 hover:bg-zinc-700"
                                                }`}
                                        >
                                            +
                                        </button>

                                        <span>{produto.quantidade}</span>

                                        <button
                                            onClick={() => decreaseQuantity(produto.id)}
                                            className="px-2 bg-zinc-800 rounded border border-lime-400 cursor-pointer"
                                        >
                                            -
                                        </button>

                                        <button
                                            onClick={() => removeFromCart(produto.id)}
                                            className="text-red-500 hover:scale-105 cursor-pointer"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 📦 ENTREGA / RESUMO */}
                    <div className="w-full border border-zinc-700 rounded-lg p-5 space-y-6 h-fit">
                        {user && enderecos.length === 0 && (
                            <div className="space-y-4">
                                <p className="text-sm text-zinc-300">
                                    Cadastre um endereço para continuar
                                </p>

                                <input
                                    name="cep"
                                    value={enderecoForm.cep}
                                    onChange={handleEnderecoChange}
                                    className="w-full px-3 py-2 rounded border bg-transparent text-white"
                                    placeholder="CEP - Apenas números"
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
                                    disabled={loadingEndereco}
                                    className="w-full bg-white text-black py-2 rounded hover:bg-zinc-200"
                                >
                                    {loadingEndereco ? "Salvando..." : "Salvar endereço"}
                                </button>
                            </div>
                        )}

                        {/* 📍 LISTAGEM DE ENDEREÇOS */}
                        {enderecos.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-zinc-300">
                                    Escolha um endereço
                                </p>

                                {enderecos.map((endereco) => (
                                    <div
                                        key={endereco.id}
                                        onClick={() => selecionarEndereco(endereco)}
                                        className={`relative w-full border border-lime-400 rounded p-3 text-sm cursor-pointer 
                                        hover:shadow-[0_0_35px_rgba(163,230,53,0.4)]
        ${enderecoSelecionado?.id === endereco.id
                                                ? "border-lime-400"
                                                : "hover:border-lime-700"
                                            }
        ${loadingFrete ? "opacity-60 pointer-events-none" : ""}
    `}
                                    >
                                        <p className="font-medium">
                                            {endereco.rua}, {endereco.numero}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {endereco.bairro} - {endereco.cidade}/{endereco.uf}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            CEP: {endereco.cep}
                                        </p>

                                        {/* 🗑️ BOTÃO EXCLUIR */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeletarEndereco(e, endereco.id)}
                                            className="absolute top-2 right-2 text-xs text-red-500 
                                            hover:scale-110 transition cursor-pointer"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 🔎 CEP MANUAL */}
                        {enderecos.length === 0 && (
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-300">
                                    Calcular frete
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Digite seu CEP - Apenas números"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded border bg-transparent"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleCalcularFrete}
                                        disabled={loadingFrete}
                                        className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200"
                                    >
                                        {loadingFrete ? "..." : "OK"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {opcoesFrete.map((opcao) => (
                            <label
                                key={opcao.tipo}
                                className="flex items-center justify-between border border-zinc-600 rounded p-3 text-sm 
        hover:shadow-[0_0_35px_rgba(163,230,53,0.4)] hover:border-lime-400 cursor-pointer"
                            >
                                <div>
                                    <p className="font-medium">{opcao.tipo}</p>
                                    <p className="text-xs text-zinc-400">
                                        Prazo: {opcao.prazoDias} dias
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span>R$ {opcao.valor.toFixed(2)}</span>
                                    <input
                                        type="radio"
                                        name="frete"
                                        checked={freteSelecionado?.tipo === opcao.tipo}
                                        onChange={() => handleSelecionarFrete(opcao)}
                                    />
                                </div>
                            </label>
                        ))}


                        {/* 💰 RESUMO */}
                        <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>R$ {cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Frete</span>
                                <span>R$ {valorFrete.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>R$ {(cartTotal + valorFrete).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔘 BOTÕES */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-zinc-800 border border-white px-4 py-2 rounded-lg
                        hover:border-lime-400 cursor-pointer"
                    >
                        Continuar comprando
                    </button>

                    <button
                        onClick={handleFinalizarCompra}
                        className="bg-white text-black px-4 py-2 rounded-lg 
                        hover:bg-zinc-200 cursor-pointer"
                    >
                        Finalizar compra
                    </button>
                </div>
            </div>
        </div>
    );
}
