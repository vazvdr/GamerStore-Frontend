export default function CartShippingOptions({
  opcoesFrete,
  cartShipping,
  handleSelecionarFrete
}) {

  return (
    <>
      {opcoesFrete.map(opcao => (
        <label
          key={opcao.tipo}
          className="flex items-center justify-between border border-zinc-600 rounded p-3 text-sm cursor-pointer"
        >

          <div>
            <p className="font-medium">{opcao.tipo}</p>

            <p className="text-xs text-zinc-400">
              Prazo: {opcao.prazoDias} dias
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span>R$ {opcao.valor.toFixed(2)}</span>

            <input
              type="radio"
              name="frete"
              checked={cartShipping === opcao.valor}
              onChange={() => handleSelecionarFrete(opcao)}
            />

          </div>

        </label>
      ))}
    </>
  );
}