// src/components/conta/FakeStoreDialog.jsx
import React from "react";

export default function FakeStoreDialog({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-red-600 text-white max-w-md w-full p-6 rounded-xl shadow-2xl border border-red-400">
        <h2 className="text-2xl font-bold mb-4">⚠ Aviso Importante ⚠</h2>

        <p className="text-sm leading-relaxed mb-6">
          Esta loja virtual é totalmente fictícia e foi criada apenas
          para fins de portfólio e demonstração técnica.
          <br /><br />
          Cadastre o cartão com o número 4242 4242 4242 4242
        </p>

        <button
          onClick={onClose}
          className="w-full bg-white text-red-600 font-semibold py-2 rounded-lg hover:bg-zinc-200 transition cursor-pointer"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}