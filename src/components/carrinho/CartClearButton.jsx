export default function CartClearButton({ onClearCart }) {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={onClearCart}
        className="
          bg-red-600 text-white px-4 py-2 rounded-lg
          hover:bg-red-700 transition cursor-pointer
        "
      >
        Limpar carrinho
      </button>
    </div>
  );
}