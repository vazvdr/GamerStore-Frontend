// src/components/conta/AccordionEndereco.jsx
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function AccordionEndereco({
  enderecoForm,
  handleEnderecoChange,
  handleSalvarEndereco,
  loading,
  enderecoEmEdicaoId,
  accordionValue,
  setAccordionValue,
}) {
  const enderecoOpen = accordionValue === "endereco";

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="endereco">
          <AccordionTrigger
            className="w-full px-4 text-white cursor-pointer flex justify-center lg:justify-between items-center text-center lg:text-left"
          >
            Dados de endereço
          </AccordionTrigger>

          {!enderecoOpen && (
            <div className="px-4 pb-0 text-sm text-zinc-400 text-center lg:text-left">
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
              className="w-full bg-white text-black py-2 rounded cursor-pointer"
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
  );
}