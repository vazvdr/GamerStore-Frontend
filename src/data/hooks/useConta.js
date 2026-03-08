// src/hooks/useConta.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { editarUsuario, deletarUsuario } from "../services/UserService";
import { getToken } from "../../utils/cookies";

export default function useConta() {
  const { user, logout } = useAuth();

  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
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

  async function handleSalvarDados(e) {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return {
    form,
    handleChange,
    handleSalvarDados,
    handleDeleteAccount,
    loading,
    dialogOpen,
    setDialogOpen,
    dialogType,
    dialogMessage,
  };
}