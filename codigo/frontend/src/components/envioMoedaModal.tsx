import { useState } from "react";


type FormEnvio = { destino: string; quantia: number; detalhes: string; };
export default function ModalEnvioMoeda({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<FormEnvio>(() => ({
        destino: "" as string,
        quantia: 0,
        detalhes: "" as string,
    }));

    const [centavos, setCentavos] = useState(0);
    const displayQuantia = form.quantia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replaceAll(/\D/g, "");
        const valor = raw === "" ? 0 : Number.parseInt(raw, 10);



        setCentavos(valor);
        setForm(prev => ({ ...prev, quantia: valor }));


        /* if (raw === "") {
            setCentavos(0);
            setForm(prev => ({ ...prev, quantia: 0 }));
            return;
        }
        const novoCentavos = parseInt(raw, 10);
        setCentavos(novoCentavos);
        setForm(prev => ({ ...prev, quantia: novoCentavos / 100 })); */

    }
    const formatBRL = (value: number) =>
        (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Enviar Moedas</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Destino</label>
                        <select
                            value={form.destino}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                            onChange={(e) => {
                                const destinoId = e.target.value;
                                setForm(f => ({ ...f, destino: destinoId }))
                            }}>
                            <option value="0">{null}</option>
                            <option value="Aluno 1">Aluno 1</option>
                            <option value="Aluno 2">Aluno 2</option>
                            <option value="Aluno 3">Aluno 3</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Quantia</label>
                        <input
                            type="text"
                            value={centavos == 0 ? "" : formatBRL(centavos)}
                            onChange={handleChange}
                            placeholder="R$ 0,00"
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <button className="table-button px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                        <button className="table-button px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                            disabled={!form.quantia}
                            onClick={() => {
                                if (globalThis.confirm("Tem certeza que deseja enviar " + (form?.quantia / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " para " + form?.destino + "?"))
                                    onClose();
                            }}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}