// src/hooks/useCartoes.js
import { useState, useRef, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { criarCartao, listarCartoes, deletarCartao } from "../services/CartoesService";

export default function useCartoes() {
  const stripe = useStripe();
  const elements = useElements();

  const [cartoes, setCartoes] = useState([]);
  const [paymentAccordionValue, setPaymentAccordionValue] = useState(null);
  const [showFakeStoreDialog, setShowFakeStoreDialog] = useState(false);
  const avisoCartaoJaExibido = useRef(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    carregarCartoes();
  }, []);

  async function carregarCartoes() {
    try {
      const data = await listarCartoes();
      setCartoes(data);
    } catch (error) {
      console.error("Erro ao carregar cartões", error);
    }
  }

  function handleCardFocus() {
    if (!avisoCartaoJaExibido.current) {
      setShowFakeStoreDialog(true);
      avisoCartaoJaExibido.current = true;
    }
  }

  async function handleSalvarCartao() {
    if (!stripe || !elements) return;

    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setDialogType("error");
        setDialogMessage(error.message);
        setDialogOpen(true);
        return;
      }

      await criarCartao({ paymentMethodId: paymentMethod.id });

      setDialogType("success");
      setDialogMessage("Cartão cadastrado com sucesso.");
      setDialogOpen(true);

      elements.getElement(CardElement).clear();
      await carregarCartoes();
    } catch (err) {
      setDialogType("error");
      setDialogMessage("Erro ao cadastrar cartão.");
      setDialogOpen(true);
    }
  }

  async function handleDeleteCartao(id) {
    try {
      await deletarCartao(id);
      await carregarCartoes();
    } catch {
      setDialogType("error");
      setDialogMessage("Erro ao remover cartão.");
      setDialogOpen(true);
    }
  }

  return {
    cartoes,
    paymentAccordionValue,
    setPaymentAccordionValue,
    showFakeStoreDialog,
    setShowFakeStoreDialog,
    dialogOpen,
    dialogType,
    dialogMessage,
    setDialogOpen,
    handleCardFocus,
    handleSalvarCartao,
    handleDeleteCartao,
    carregarCartoes,
  };
}