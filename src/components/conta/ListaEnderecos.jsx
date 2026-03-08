// src/components/conta/ListaEnderecos.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ListaEnderecos({ enderecos, handleEditarEndereco, handleDeletarEndereco }) {
  return (
    <div>
      <h1 className="text-white text-2xl mb-4">Endereços cadastrados</h1>

      <div className="grid grid-cols-1 gap-4">
        {enderecos.map((endereco) => (
          <div
            key={endereco.id}
            className={`relative border rounded p-3 text-white ${
              endereco.principal ? "border-lime-400" : "border-zinc-600"
            }`}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleEditarEndereco(endereco)}
                className="p-1.5 rounded border border-zinc-600 hover:border-lime-400 transition cursor-pointer"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => handleDeletarEndereco(endereco.id)}
                className="p-1.5 rounded border border-zinc-600 hover:border-red-500 transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p className="font-semibold pr-14">
              {endereco.rua}, {endereco.numero}
              {endereco.principal && (
                <span className="ml-2 text-lime-400 text-xs">(Principal)</span>
              )}
            </p>

            <p className="text-sm text-zinc-300">
              {endereco.bairro} - {endereco.cidade}/{endereco.estado}
            </p>

            <p className="text-xs text-zinc-400">CEP: {endereco.cep}</p>
          </div>
        ))}
      </div>
    </div>
  );
}