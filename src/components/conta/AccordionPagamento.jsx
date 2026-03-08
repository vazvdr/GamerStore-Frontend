import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function AccordionPagamento({
  handleCardFocus,
  handleSalvarCartao,
  accordionValue,
  setAccordionValue,
}) {
  const pagamentoOpen = accordionValue === "pagamento";

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="pagamento">
          <AccordionTrigger
            className="w-full px-4 text-white cursor-pointer flex justify-center lg:justify-between items-center text-center lg:text-left"
          >
            Dados de pagamento
          </AccordionTrigger>

          {!pagamentoOpen && (
            <div className="px-4 pb-0 text-sm text-zinc-400 text-center lg:text-left">
              Cadastre e gerencie seus cartões de crédito
            </div>
          )}

          <AccordionContent className="px-4 space-y-2">
            <div className="border border-zinc-600 rounded p-3">
              <CardElement
                onFocus={handleCardFocus}
                options={{
                  style: {
                    base: {
                      color: "#ffffff",
                      fontSize: "16px",
                    },
                  },
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSalvarCartao}
              className="w-full bg-white text-black py-2 rounded cursor-pointer"
            >
              Salvar cartão
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}