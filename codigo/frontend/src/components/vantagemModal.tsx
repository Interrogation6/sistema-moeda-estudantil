import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type VantagemItem = { id: number; nome: string; descricao: string; empresa: string; valor: number; ativo: boolean; };
type FormVantagem = { nome: string; descricao: string; valor: string; };
type VantagemDTO = Partial<{ nome: string; descricao: string; ativo: boolean; valor: number; empresa_id: number; }>;

interface ModalVantagemProps {
    vantagem?: VantagemItem;
    onClose: () => void;
    onSaved: (vantagemAtualizada: VantagemItem) => void;
}

export default function ModalVantagem({ vantagem: vantagem, onClose, onSaved }: ModalVantagemProps) {

    const [form, setForm] = useState<FormVantagem>(() => ({
        nome: "",
        descricao: "",
        valor: "0",
    }));

    useEffect(() => {
        async function fetchLookups() {

            if (!vantagem) return;

            setForm(f => ({
                ...f,
                nome: vantagem.nome,
                descricao: vantagem.descricao,
                valor: String(vantagem.valor),
            }));
        }

        fetchLookups();
    }, [vantagem]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Cadastrar Vantagem</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Nome</label>
                        <input
                            type="text"
                            value={form.nome}
                            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                        <input
                            type="text"
                            value={form.descricao}
                            onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Valor</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500"

                            value={form.valor}
                            onChange={(e) => {
                                let valorstr = e.target.value.replace(/\D/g, "");
                                if (valorstr === "") valorstr = "0";
                                const numero = Number(valorstr) / 100;
                                const formatado = numero.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                });
                                setForm((f) => ({ ...f, valor: formatado }));
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button className="table-button px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                    <button className="table-button px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                        disabled={!form.valor || !form.nome}
                        onClick={() => {
                            if (!vantagem) return;
                            Salvar(form, vantagem, onSaved, onClose);
                        }}>Salvar</button>
                </div>
                <button aria-label="Fechar" onClick={onClose}
                    className="absolute top-2 right-3 w-8 h-8 inline-flex items-center justify-center
                rounded-full hover:bg-white/10 active:bg-white/15 leading-none p-0 outline-none">
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}

async function Salvar(
    form: FormVantagem,
    vantagem: VantagemItem,
    onSaved: (vantagem: VantagemItem) => void,
    onClose: () => void
) {

    const payload = buildPayloadParcial(vantagem, form/* , isCreate */);

    if (Object.keys(payload).length === 0) {
        onClose(); // nada mudou
        return;
    }
    try {
        const res = await fetch(`http://localhost:8080/vantagem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const vantagemAtualizada: VantagemItem = {
            ...vantagem,
            nome: form.nome,
            descricao: vantagem.descricao,
            valor: Number(form.valor),
            empresa: vantagem.empresa,
        };

        onSaved(vantagemAtualizada);
        onClose();
    } catch (err) {
        console.error("Erro ao salvar aluno:", err);
    }
}
function buildPayloadParcial(
    vantagem: VantagemItem,
    form: FormVantagem,
    /* isCreate?: boolean, */
): VantagemDTO {
    const dto: VantagemDTO = {};
    const valorNumber = Number(form.valor.replace(/\D/g, "")) / 100;

    if (form.nome.trim() && form.nome !== vantagem.nome) dto.nome = form.nome;
    if (form.descricao.trim()) dto.descricao = form.descricao;
    if (form.valor) dto.valor = valorNumber;
    dto.empresa_id = 8;
    dto.ativo = true;

    console.log(vantagem.id);


    return dto;
}