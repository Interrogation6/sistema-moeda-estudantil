import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";


type FormEnvio = { destino: string; quantia: number; detalhes: string; };
type AlunoItem = { id: number; nome: string };
export default function ModalEnvioMoeda({ onClose }: { onClose: () => void }) {
    const { user } = useLogin();
    const [form, setForm] = useState<FormEnvio>(() => ({
        destino: "" as string,
        quantia: 0,
        detalhes: "" as string,
    }));

    const [centavos, setCentavos] = useState(0);
    const [alunos, setAlunos] = useState<AlunoItem[]>([]);
    const [sending, setSending] = useState(false);
    //const displayQuantia = form.quantia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

    useEffect(() => {
        let mounted = true;
        async function fetchAlunos() {
            try {
                const res = await fetch('http://localhost:8080/aluno/getAll');
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;
                setAlunos(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao carregar alunos:', err);
            }
        }
        fetchAlunos();
        return () => { mounted = false };
    }, []);

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
                            <option value="">{null}</option>
                            {alunos.map(a => (
                                <option key={a.id} value={String(a.id)}>
                                    {a.nome}
                                </option>
                            ))}
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
                            disabled={!form.quantia || !form.destino || sending}
                            onClick={async () => {
                                const selecionado = alunos.find(a => String(a.id) === form.destino);
                                const nomeDestino = selecionado ? selecionado.nome : form.destino;
                                const confirmMsg = "Tem certeza que deseja enviar " + (form?.quantia / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + " para " + nomeDestino + "?";
                                if (!globalThis.confirm(confirmMsg)) return;
                                if (!user) {
                                    globalThis.alert('Usuário não autenticado.');
                                    return;
                                }
                                try {
                                    setSending(true);
                                    const remetenteId = user.id;
                                    const destinatarioId = Number(form.destino);
                                    const valorCentavos = Number(form.quantia);
                                    const res = await fetch(`http://localhost:8080/aluno/${remetenteId}/enviar/${valorCentavos}/${destinatarioId}`, {
                                        method: 'POST'
                                    });
                                    if (res.status === 204) {
                                        globalThis.alert('Envio realizado com sucesso.');
                                        onClose();
                                    } else if (res.status === 409) {
                                        globalThis.alert('Saldo insuficiente.');
                                    } else {
                                        const text = await res.text();
                                        globalThis.alert('Erro ao enviar: ' + res.status + ' ' + (text || res.statusText));
                                    }
                                } catch (err) {
                                    console.error('Erro ao enviar moeda:', err);
                                    globalThis.alert('Erro ao enviar moeda. Veja console.');
                                } finally {
                                    setSending(false);
                                }
                            }}>Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}