export default function CartSummary({
  subtotal = 0,
  shipping = 0,
  total = 0
}) {
  return (
    <div className="border-t border-zinc-700 pt-4 space-y-2 text-sm">

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Frete</span>
        <span>R$ {shipping.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

    </div>
  );
}