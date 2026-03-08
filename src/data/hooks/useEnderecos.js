import { useState, useEffect } from "react";
import {
    listarEnderecos,
    criarEndereco,
    deletarEndereco
} from "../services/EnderecoService";

export default function useEnderecos(user) {

    const [enderecos, setEnderecos] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

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
    const [erroEndereco, setErroEndereco] = useState(null);

    useEffect(() => {
        if (!user) return;
        async function carregarEnderecos() {
            try {
                const data = await listarEnderecos();
                setEnderecos(data);
            } catch (error) {
                console.error("Erro ao listar endereços", error);
                setErroEndereco("Erro ao carregar endereços");
            }
        }
        carregarEnderecos();
    }, [user]);

    function handleEnderecoChange(e) {
        const { name, value, type, checked } = e.target;
        setEnderecoForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSalvarEndereco() {
        if (!enderecoForm.cep || !enderecoForm.rua || !enderecoForm.numero) {
            setErroEndereco("Preencha CEP, Rua e Número");
            return false;
        }
        try {
            setLoadingEndereco(true);
            await criarEndereco(enderecoForm);
            const data = await listarEnderecos();
            setEnderecos(data);
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
            return true;
        } catch (error) {
            console.error("Erro ao salvar endereço", error);
            setErroEndereco("Erro ao salvar endereço");
            return false;
        } finally {
            setLoadingEndereco(false);
        }
    }

    function handleEditarEndereco(endereco) {

        setEnderecoForm({
            cep: endereco.cep || "",
            rua: endereco.rua || "",
            numero: endereco.numero || "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estado: endereco.estado || ""
        });

    }

    async function handleDeletarEndereco(enderecoId) {
        try {
            await deletarEndereco(enderecoId);
            setEnderecos(prev =>
                prev.filter(end => end.id !== enderecoId)
            );
            if (enderecoSelecionado?.id === enderecoId) {
                setEnderecoSelecionado(null);
            }
        } catch (error) {
            console.error("Erro ao deletar endereço", error);
            setErroEndereco("Erro ao deletar endereço");
        }

    }
    return {
        enderecos,
        enderecoSelecionado,
        setEnderecoSelecionado,
        enderecoForm,
        handleEnderecoChange,
        handleSalvarEndereco,
        handleEditarEndereco,
        handleDeletarEndereco,
        loadingEndereco,
        erroEndereco,
        setErroEndereco
    };

}