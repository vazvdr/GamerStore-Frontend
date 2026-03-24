import { useState } from "react";
import { calcularFretePorCep } from "../services/ShippingService";
import { applyShipping } from "../services/CartService";
import { useCart } from "../contexts/CartContext";

export default function useFrete(user) {

    const { loadCart } = useCart();

    const [cep, setCep] = useState("");
    const [opcoesFrete, setOpcoesFrete] = useState([]);
    const [freteSelecionado, setFreteSelecionado] = useState(null);
    const [loadingFrete, setLoadingFrete] = useState(false);

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

    async function selecionarEndereco(
        endereco,
        setEnderecoSelecionado
    ) {
        if (loadingFrete) return;
        setEnderecoSelecionado(endereco);
        setCep(endereco.cep);
        setOpcoesFrete([]);
        setFreteSelecionado(null);
        calcularFreteAutomatico(endereco.cep);
    }

    async function handleSelecionarFrete(opcao) {
        if (!user) {
            console.warn("Usuário não logado, não é possível aplicar frete no backend");
            return;
        }

        try {

            await applyShipping(user.id, cep, opcao.tipo);

            setFreteSelecionado(opcao);

            // Atualiza o carrinho com valores do backend
            await loadCart();

        } catch (error) {
            console.error("Erro ao aplicar frete:", error);
        }
    }

    const valorFrete = freteSelecionado?.valor || 0;

    return {
        cep,
        setCep,
        opcoesFrete,
        freteSelecionado,
        loadingFrete,
        valorFrete,
        handleCalcularFrete,
        handleSelecionarFrete,
        selecionarEndereco
    };
}