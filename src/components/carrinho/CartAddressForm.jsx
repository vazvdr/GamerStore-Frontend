export default function CartAddressForm({
  enderecoForm,
  handleEnderecoChange,
  handleSalvarEndereco,
  loadingEndereco
}) {
  return (
    <div className="space-y-4">

      <p className="text-sm text-zinc-300">
        Cadastre um endereço para continuar
      </p>

      <input
        name="cep"
        value={enderecoForm.cep}
        onChange={handleEnderecoChange}
        className="w-full px-3 py-2 rounded border bg-transparent text-white"
        placeholder="CEP - Apenas números"
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
        disabled={loadingEndereco}
        className="w-full bg-white text-black py-2 rounded hover:bg-zinc-200"
      >
        {loadingEndereco ? "Salvando..." : "Salvar endereço"}
      </button>

    </div>
  );
}