export default function CartActions({
  navigate,
  handleFinalizarCompra
}) {

  return (
    <div className="flex justify-end gap-3 mt-4">

      <button
        onClick={() => navigate("/")}
        className="bg-zinc-800 border border-white px-4 py-2 rounded-lg hover:border-lime-400 cursor-pointer"
      >
        Continuar comprando
      </button>

      <button
        onClick={() => {
          console.log("Clicou finalizar");
          handleFinalizarCompra();
        }}
        className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 cursor-pointer"
      >
        Finalizar compra
      </button>

    </div>
  );
}