export default function InformacoesEntrega({
    user,
    enderecoSelecionado,
    freteSelecionado
}) {
    return (
        <div className="bg-transparent border border-lime-400 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
                Informações de Entrega
            </h2>

            <div className="space-y-4">

                <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="font-medium">
                        {user?.email || "Usuário não autenticado"}
                    </p>
                </div>

                <hr className="border-zinc-700" />

                <div>
                    <p className="text-gray-400 text-sm">Endereço</p>
                    <p className="font-medium">
                        {enderecoSelecionado ? (
                            <>
                                {enderecoSelecionado.rua}, {enderecoSelecionado.numero}<br />
                                {enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.uf}<br />
                                CEP {enderecoSelecionado.cep}
                            </>
                        ) : (
                            "Nenhum endereço selecionado"
                        )}
                    </p>
                </div>

                <hr className="border-zinc-700" />

                <div>
                    <p className="text-gray-400 text-sm">Frete selecionado</p>
                    <p className="font-medium">
                        {freteSelecionado ? (
                            <>
                                {freteSelecionado.tipo} - {freteSelecionado.prazoDias} dias<br />
                                R$ {freteSelecionado.valor.toFixed(2)}
                            </>
                        ) : (
                            "Frete não selecionado"
                        )}
                    </p>
                </div>

            </div>
        </div>
    );
}