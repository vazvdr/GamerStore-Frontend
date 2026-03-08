import { Trash2 } from "lucide-react";

export default function CartItem({
  produto,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  navigate
}) {
  return (
    <li
      className="
        grid grid-cols-[1fr_auto]
        md:flex md:items-center md:justify-between
        border border-lime-400 p-4 rounded-lg gap-4
        transition-all hover:bg-zinc-900/60
        hover:shadow-[0_0_35px_rgba(163,230,53,0.4)]
      "
    >
      <div
        className="flex items-start gap-4 cursor-pointer"
        onClick={() => navigate(`/produto/${produto.id}`)}
      >
        <img
          src={produto.imageUrl}
          alt={produto.nome}
          className="w-20 h-20 object-contain bg-zinc-900 p-2 rounded"
        />

        <div>
          <p className="font-semibold">{produto.nome}</p>

          <p className="text-xs text-zinc-400 line-clamp-2">
            {produto.descricao}
          </p>

          <p className="text-sm mt-1">
            R$ {produto.preco.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-4">

        <button
          onClick={() => increaseQuantity(produto.id)}
          disabled={produto.quantidade >= produto.estoque}
          className={`px-2 rounded border border-lime-400 cursor-pointer
            ${produto.quantidade >= produto.estoque
              ? "bg-zinc-700 opacity-50"
              : "bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          +
        </button>

        <span>{produto.quantidade}</span>

        <button
          onClick={() => decreaseQuantity(produto.id)}
          className="px-2 bg-zinc-800 rounded border border-lime-400 cursor-pointer"
        >
          -
        </button>

        <button
          onClick={() => removeFromCart(produto.id)}
          className="text-red-500 hover:scale-105 cursor-pointer"
        >
          <Trash2 size={24} />
        </button>

      </div>
    </li>
  );
}