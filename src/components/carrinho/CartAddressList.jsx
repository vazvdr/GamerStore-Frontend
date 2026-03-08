import { Trash2 } from "lucide-react";

export default function CartAddressList({
  enderecos = [],
  selecionarEndereco,
  enderecoSelecionado,
  handleDeletarEndereco,
  loadingFrete
}) {

  return (
    <div className="space-y-2">

      <p className="text-sm text-zinc-300">
        Escolha um endereço
      </p>

      {enderecos.length === 0 && (
        <p className="text-xs text-zinc-400">
          Nenhum endereço cadastrado
        </p>
      )}

      {enderecos.map((endereco) => (
        <div
          key={endereco.id}
          onClick={() => selecionarEndereco(endereco)}
          className={`relative w-full border border-lime-400 rounded p-3 text-sm cursor-pointer
          ${enderecoSelecionado?.id === endereco.id
              ? "border-lime-400"
              : "hover:border-lime-700"
            }
          ${loadingFrete ? "opacity-60 pointer-events-none" : ""}
          hover:shadow-[0_0_35px_rgba(163,230,53,0.4)]
          `}
        >

          <p className="font-medium">
            {endereco.rua}, {endereco.numero}
          </p>

          <p className="text-xs text-zinc-400">
            {endereco.bairro} - {endereco.cidade}/{endereco.uf}
          </p>

          <p className="text-xs text-zinc-400">
            CEP: {endereco.cep}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeletarEndereco(endereco.id);
            }}
            className="absolute top-2 right-2 text-red-500 hover:scale-110 transition cursor-pointer"
          >
            <Trash2 size={20} />
          </button>

        </div>
      ))}

    </div>
  );
}