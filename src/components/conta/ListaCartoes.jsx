// src/components/conta/ListaCartoes.jsx
import React from "react";
import { Trash2, CreditCard } from "lucide-react";

export default function ListaCartoes({ cartoes, handleDeleteCartao }) {
  return (
    <div>
      <h1 className="text-white text-2xl mb-4">Cartões cadastrados</h1>

      <div className="grid grid-cols-1 gap-4">
        {cartoes.map((cartao) => (
          <div
            key={cartao.id}
            className="relative border border-zinc-600 rounded p-3 text-white hover:border-lime-400"
          >
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={() => handleDeleteCartao(cartao.id)}
                className="p-1.5 rounded border border-zinc-600 hover:border-red-500 transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard size={18} />
              <span className="font-semibold">
                {cartao.brand.toUpperCase()} •••• {cartao.last4}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}