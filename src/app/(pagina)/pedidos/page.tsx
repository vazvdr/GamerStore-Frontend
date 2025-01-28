'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";

// Definindo os tipos
type Item = {
  nome: string;
  quantidade: number;
  imagem: string;
};

type Pedido = {
  data: string; // Data no formato "DD/MM/AAAA"
  hora: string; // Hora no formato "HH:MM"
  itens: Item[];
  total: number;
  parcelas: number;
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const pedidosSalvos = localStorage.getItem('pedidos');
    if (pedidosSalvos) {
      const pedidosParsed = JSON.parse(pedidosSalvos) as Pedido[];
      // Invertendo a ordem dos pedidos
      setPedidos(pedidosParsed.reverse());
    }
  }, []);

  return (
    <div className="flex justify-center items-center p-6 bg-transparent">
      <div className="w-full max-w-2xl md:w-2/3">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          Seus Pedidos
        </h1>
        {pedidos.length > 0 ? (
          <ul className="space-y-6">
            {pedidos.map((pedido, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 h-full w-full bg-purple-900/30 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                <div className="bg-transparent rounded-lg shadow-md p-6 border border-purple-900 relative z-10">
                  <p className="text-sm text-white">
                    <strong className="text-yellow-500">Data:</strong> {pedido.data} às <strong>{pedido.hora}</strong>
                  </p>
                  <p className="text-sm text-white">
                    <strong className="text-yellow-500">Parcelas:</strong> {pedido.parcelas}x
                  </p>
                  <div className="mt-4">
                    <p className="text-md font-semibold mb-2 text-red-500">Itens:</p>
                    <ul className="grid grid-cols-1 justify-center md:grid-cols-1 gap-4">
                      {pedido.itens.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center bg-transparent p-4 rounded-lg shadow-sm border border-white"
                        >
                          <img
                            src={item.imagem}
                            alt={item.nome}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                          />
                          <div>
                            <p className="font-medium text-white">{item.nome}</p>
                            <p className="text-sm text-white">
                              Quantidade: <strong>{item.quantidade}</strong>
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-right mt-4 text-lg font-semibold text-white">
                    Total: R$ {pedido.total.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500 text-center font-semibold">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
}
