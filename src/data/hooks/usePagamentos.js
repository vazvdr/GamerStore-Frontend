import { useEffect, useState, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getCart } from "../services/CartService";
import { listarCartoes, criarCartao, deletarCartao } from "../services/CartoesService";
import { confirmarPagamento } from "../services/PagamentoService";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export function usePagamento(user, cartItems) {

  const stripe = useStripe();
  const elements = useElements();

  const [backendTotal, setBackendTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [cartoes, setCartoes] = useState([]);
  const [loadingCartoes, setLoadingCartoes] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [showFakeStoreDialog, setShowFakeStoreDialog] = useState(false);

  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [alertDialog, setAlertDialog] = useState({ open: false, title: "", description: "" });

  const avisoJaExibido = useRef(false);

  // 🔐 BLOQUEIO DE ACESSO DIRETO
  useEffect(() => {

    const autorizado = sessionStorage.getItem("checkout_autorizado");

    if (!autorizado) {
      navigate("/carrinho");
    }

  }, [navigate]);

  // 🛒 BUSCAR CARRINHO NO BACKEND
  useEffect(() => {

    async function fetchCart() {
      if (!user?.id) return;
      try {
        const data = await getCart(user.id);
        setBackendTotal(Number(data.total));

      } catch (error) {

        console.error("Erro ao buscar carrinho:", error);

        setAlert({
          type: "error",
          message: "Erro ao buscar carrinho."
        });

      } finally {

        setLoadingCart(false);

      }

    }

    fetchCart();

  }, [user]);

  // 💳 BUSCAR CARTÕES
  useEffect(() => {

    async function fetchCartoes() {

      if (metodoPagamento !== "cartao") return;

      try {

        setLoadingCartoes(true);

        const data = await listarCartoes();

        setCartoes(data);

      } catch (error) {

        console.error("Erro ao listar cartões:", error);

        setAlert({
          type: "error",
          message: "Erro ao listar cartões."
        });

      } finally {

        setLoadingCartoes(false);

      }

    }

    fetchCartoes();

  }, [metodoPagamento]);

  // 💳 SELECIONAR CARTÃO
  function handleSelecionarCartao(paymentMethodId) {

    setCartaoSelecionado(paymentMethodId);

    if (!avisoJaExibido.current) {
      setShowFakeStoreDialog(true);
      avisoJaExibido.current = true;
    }

  }

  function handleCardFocus() {

    if (!avisoJaExibido.current) {
      setShowFakeStoreDialog(true);
      avisoJaExibido.current = true;
    }

  }

  // 💳 SALVAR CARTÃO
  async function handleSalvarCartao() {

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement
      });

    if (error) {

      setAlert({
        type: "error",
        message: "Erro ao criar cartão."
      });

      return;

    }

    try {

      await criarCartao({
        paymentMethodId: paymentMethod.id
      });

      setAlert({
        type: "success",
        message: "Cartão salvo com sucesso!"
      });

      const updated = await listarCartoes();

      setCartoes(updated);

    } catch {

      setAlert({
        type: "error",
        message: "Erro ao salvar cartão."
      });

    }

  }

  // 🗑️ DELETAR CARTÃO
  async function handleDeleteCartao(id) {
    try {
      await deletarCartao(id);
      const updated = cartoes.filter(c => c.id !== id);
      setCartoes(updated);
      if (cartaoSelecionado === id) {
        setCartaoSelecionado(null);
      }
      setAlert({
        type: "success",
        message: "Cartão removido com sucesso!"
      });
    } catch {
      setAlert({
        type: "error",
        message: "Erro ao deletar cartão."
      });
    }
  }

  // 💰 CONFIRMAR PAGAMENTO
  async function handleConfirmarPagamento() {
    if (metodoPagamento !== "cartao") {
      setAlertDialog({
        open: true,
        title: "Forma de pagamento",
        description: "Selecione cartão como forma de pagamento."
      });
      return;

    }
    if (!cartaoSelecionado) {
      setAlertDialog({
        open: true,
        title: "Cartão não selecionado",
        description: "Selecione um cartão para continuar."
      });
      return;
    }

    const items = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantidade
    }));
    try {
      await confirmarPagamento({
        userId: user.id,
        amount: Number(backendTotal),
        paymentMethodId: cartaoSelecionado,
        stripeCustomerId: user.stripeCustomerId,
        items
      });
      clearCart();
      setAlertDialog({
        open: true,
        title: "Pagamento aprovado 🎉",
        description: "Seu pagamento foi realizado com sucesso!"
      });
      sessionStorage.setItem("pagamento_aprovado", "true");
      setTimeout(() => {
        navigate("/pagamento-sucesso");
      }, 2000);
    } catch (error) {
      console.error("Erro no pagamento:", error);
      setAlertDialog({
        open: true,
        title: "Erro no pagamento",
        description: "Erro ao processar pagamento."
      });
    }
  }

  // 🧾 FINALIZAR COMPRA
  function finalizarCompra({ enderecoSelecionado, freteSelecionado }) {
    if (!user) {
      navigate("/login");
      return;
    }

    sessionStorage.setItem("checkout_autorizado", "true");
    navigate("/pagamento", {
      state: {
        endereco: enderecoSelecionado,
        frete: freteSelecionado
      }
    });

  }

  return {
    backendTotal,
    loadingCart,
    metodoPagamento,
    setMetodoPagamento,
    cartoes,
    loadingCartoes,
    cartaoSelecionado,
    handleSelecionarCartao,
    handleSalvarCartao,
    handleDeleteCartao,
    handleConfirmarPagamento,
    handleCardFocus,
    showFakeStoreDialog,
    setShowFakeStoreDialog,
    alert,
    setAlert,
    alertDialog,
    setAlertDialog,
    finalizarCompra
  };

}