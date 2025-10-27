import { useEffect, useState } from "react";
import { X } from "lucide-react";

type AlunoItem = { nome: string; curso: string; instituicao: string; saldo: number; };
type CursoItem = { id: number; nome: string; instituicaoId: number; };
type InstituicaoItem = { id: number; nome: string; };

interface ModalEditarAlunoProps {
    aluno: AlunoItem | null;
    onClose: () => void;
}

export default function ModalEditarAluno({ aluno, onClose }: ModalEditarAlunoProps) {
    const formatBRL = (valor: number) =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const [cursos, setCursos] = useState<CursoItem[]>([]);
    const [instituicoes, setInstituicoes] = useState<InstituicaoItem[]>([]);

    // ⬇️ Lazy initializer: roda só na montagem e já formata o saldo inicial
    const [form, setForm] = useState(() => ({
        nome: aluno?.nome ?? "",
        cursoId: "" as number | "",
        instituicaoId: "" as number | "",
        saldo: aluno ? formatBRL(aluno.saldo) : "", // << já começa com "R$ 120,00"
    }));

    // Carrega lookups (não precisa reformatar saldo aqui)
    useEffect(() => {
        (async () => {
            const [resCursos, resInsts] = await Promise.all([
                fetch("http://localhost:8080/curso/getAll"),
                fetch("http://localhost:8080/instituicao/getAll"),
            ]);
            const cursosData = await resCursos.json();
            const instData = await resInsts.json();
            setCursos(cursosData);
            setInstituicoes(instData);
        })();
    }, []);

    // Se o modal for aberto com um aluno diferente, sincronize nome/saldo
    useEffect(() => {
        if (!aluno) return;
        setForm(f => ({
            ...f,
            nome: aluno.nome,
            saldo: formatBRL(aluno.saldo), // garante formatação ao trocar de aluno
        }));
    }, [aluno]);

    const instituicoesFiltradas = (() => {
        if (!form.cursoId) return [];
        const cursoSel = cursos.find((c) => c.id === Number(form.cursoId));
        if (!cursoSel) return [];
        return instituicoes.filter((i) => i.id === cursoSel.instituicaoId);
    })();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Editar Aluno</h2>

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
                        <label className="block text-sm text-gray-300 mb-1">Curso</label>
                        <select
                            value={form.cursoId}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    cursoId: e.target.value ? Number(e.target.value) : "",
                                    instituicaoId: "",
                                }))
                            }
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecione um curso</option>
                            {cursos.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Instituição</label>
                        <select
                            value={form.instituicaoId}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    instituicaoId: e.target.value ? Number(e.target.value) : "",
                                }))
                            }
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                            disabled={!form.cursoId}
                        >
                            <option value="">
                                {form.cursoId ? "Selecione a instituição" : "Selecione um curso primeiro"}
                            </option>
                            {instituicoesFiltradas.map((i) => (
                                <option key={i.id} value={i.id}>
                                    {i.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Saldo</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-blue-500"

                            value={form.saldo}
                            onChange={(e) => {
                                let valor = e.target.value.replace(/\D/g, "");
                                if (valor === "") valor = "0";
                                const numero = Number(valor) / 100;
                                const formatado = numero.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                });
                                setForm((f) => ({ ...f, saldo: formatado }));
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                    <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500" onClick={onClose}>Salvar</button>
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
