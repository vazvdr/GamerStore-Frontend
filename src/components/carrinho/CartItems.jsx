import CartItem from "./CartItem";

export default function CartItems({
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  navigate,
  ClearCartButton
}) {

  return (
    <div className="w-full space-y-4">

      <ul className="space-y-4">
        {cartItems.map(produto => (
          <CartItem
            key={produto.id}
            produto={produto}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeFromCart={removeFromCart}
            navigate={navigate}
          />
        ))}
      </ul>

      {/* botão abaixo dos itens */}
      {ClearCartButton}

    </div>
  );
}