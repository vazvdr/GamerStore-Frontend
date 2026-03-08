import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PagamentoSucesso() {

    const navigate = useNavigate();

    useEffect(() => {

        const pagamentoAprovado = sessionStorage.getItem("pagamento_aprovado");

        if (!pagamentoAprovado) {
            navigate("/");
        }

    }, []);

    function voltarLoja() {
        sessionStorage.removeItem("pagamento_aprovado");
        navigate("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4">

            <div className="bg-neutral-900 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center">

                <CheckCircle
                    size={90}
                    className="text-green-500 mx-auto mb-6"
                />

                <h1 className="text-3xl font-bold mb-4">
                    Pagamento aprovado 🎉
                </h1>

                <p className="text-neutral-400 mb-8">
                    Seu pedido foi processado com sucesso.
                    Em breve você receberá a confirmação no seu email.
                </p>

                <button
                    onClick={voltarLoja}
                    className="w-full bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg 
                    font-semibold cursor-pointer"
                >
                    Voltar para loja
                </button>

            </div>

        </div>
    );
}