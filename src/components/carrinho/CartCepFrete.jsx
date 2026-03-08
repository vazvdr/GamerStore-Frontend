export default function CartCepFrete({
  cep,
  setCep,
  handleCalcularFrete,
  loadingFrete
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-300">
        Calcular frete
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite seu CEP - Apenas números"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          className="flex-1 px-3 py-2 rounded border bg-transparent"
        />

        <button
          type="button"
          onClick={handleCalcularFrete}
          disabled={loadingFrete}
          className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200"
        >
          {loadingFrete ? "..." : "OK"}
        </button>
      </div>
    </div>
  );
}