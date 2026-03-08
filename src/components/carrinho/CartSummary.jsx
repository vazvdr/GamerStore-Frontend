export default function CartSummary({
  cartTotal,
  valorFrete
}) {
  return (
    <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>R$ {cartTotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Frete</span>
        <span>R$ {valorFrete.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>R$ {(cartTotal + valorFrete).toFixed(2)}</span>
      </div>

    </div>
  );
}