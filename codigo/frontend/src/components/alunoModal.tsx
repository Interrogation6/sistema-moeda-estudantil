import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { baseUrl } from "../Params";

type AlunoItem = { id: number; nome: string; email: string; curso: string; cursoId?: number; instituicao: string; saldo: number; };
type CursoItem = { id: number; nome: string; instituicao: string; };
type FormAluno = { nome: string; email: string; senha: string; cursoId: string; instituicaoNome: string; saldo: string; };
type UpdateAlunoDTO = Partial<{nome: string; senha_hash: string; email: string; cursoId: number; saldo: number;}>;

interface ModalEditarAlunoProps {
    aluno?: AlunoItem ;
    isCreate?: boolean;
    onClose: () => void;
    onSaved: (alunoAtualizado: AlunoItem) => void;
    onCreated?: (novoAluno: AlunoItem) => void;
}

export default function ModalEditarAluno({ aluno, isCreate = false, onClose, onSaved }: ModalEditarAlunoProps) {
    const formatBRL = (valor: number) =>
        valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const [cursos, setCursos] = useState<CursoItem[]>([]);

    const [form, setForm] = useState<FormAluno>(() => ({
        nome: aluno?.nome ?? "",
        email: aluno?.email ?? "",
        senha: "",
        cursoId: "" as string,
        instituicaoNome: "" as string,
        saldo: aluno ? formatBRL(aluno.saldo) : "",
    }));

    useEffect(() => {
        async function fetchLookups() {
            const resCursos = await fetch(baseUrl + "/curso/getAll")

            const data: CursoItem[] = await resCursos.json();
            setCursos(data);

            if (!aluno || isCreate) return;

            const cursoSel = data.find((c) => c.nome === aluno.curso);

            setForm(f => ({
                ...f,
                nome: aluno.nome,
                email: aluno.email,
                cursoId: cursoSel ? String(cursoSel.id) : "",
                instituicaoNome: aluno.instituicao ?? "",
                saldo: formatBRL(aluno.saldo),
            }));
        }

        fetchLookups();
    }, [aluno]);

    const instituicoesFiltradas: string[] = (() => {
        if (!form.cursoId) return [];
        const cursoSel = cursos.find(c => String(c.id) === form.cursoId);
        if (!cursoSel) return [];
        const nomeCurso = cursoSel.nome;

        const nomes = cursos
            .filter(c => c.nome === nomeCurso)
            .map(c => c.instituicao);
        return Array.from(new Set(nomes));
    })();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">{isCreate ? "Novo Aluno" : "Editar Aluno"}</h2>

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
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input
                            type="text"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Senha</label>
                        <input
                            type="text"
                            value={form.senha}
                            onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
                            placeholder="********"
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Curso</label>
                        <select
                            value={form.cursoId}
                            onChange={(e) => {
                                const novoCursoId = e.target.value; // string
                                setForm(f => ({ ...f, cursoId: novoCursoId, instituicaoNome: "" }));
                            }}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">{null}</option>
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
                            value={form.instituicaoNome}
                            onChange={(e) => setForm(f => ({ ...f, instituicaoNome: e.target.value }))}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                            disabled={!form.cursoId}
                        >
                            <option value="">
                                {form.cursoId ? null : "Selecione um curso primeiro"}
                            </option>
                            {instituicoesFiltradas.map(nome => (
                                <option key={nome} value={nome}>
                                    {nome}
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
                    <button className="table-button px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                    <button className="table-button px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                        disabled={!form.cursoId || !form.nome || !form.saldo}
                    onClick={() => {if(!aluno) return;
                        Salvar(form, aluno, cursos, onSaved, onClose, isCreate)}}>Salvar</button>
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
    form: FormAluno,
    aluno: AlunoItem,
    cursos: CursoItem[],
    onSaved: (aluno: AlunoItem) => void,
    onClose: () => void,
    isCreate: boolean
) {
    const saldoNumber = Number(form.saldo.replace(/\D/g, "")) / 100;
    const cursoSel = cursos.find((c) => String(c.id) === form.cursoId);

    const payload = buildPayloadParcial(aluno, form, cursoSel/* , isCreate */);

    if (Object.keys(payload).length === 0) {
        onClose(); // nada mudou
        return;
    }
    if (isCreate) {
        if (!form.senha || form.senha.length < 4) {
            globalThis.alert("Senha deve possuir no mínimo 4 caracteres.");
            return;
        }
    } else {
        if (form.senha && form.senha.length < 4) {
            globalThis.alert("Senha deve possuir no mínimo 4 caracteres.");
            return;
        }
        if (form.senha) {
            if (!globalThis.confirm("Campo 'Senha' possui valor. Aplicar alteração de senha?")) {
                return;
            }
        }
    }
    try {
        let res;
        if(isCreate){
            res = await fetch(baseUrl + `/aluno`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        } else {
            res = await fetch(baseUrl + `/aluno/${aluno.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const alunoAtualizado: AlunoItem = {
            ...aluno,
            nome: form.nome,
            curso: cursoSel ? cursoSel.nome : aluno.curso,
            instituicao: form.instituicaoNome || aluno.instituicao,
            saldo: saldoNumber,
        };

        onSaved(alunoAtualizado);
        onClose();
    } catch (err) {
        console.error("Erro ao salvar aluno:", err);
    }
}
function buildPayloadParcial(
  aluno: AlunoItem,
  form: FormAluno,
  cursoSel?: CursoItem,
    /* isCreate?: boolean, */
): UpdateAlunoDTO {
  const dto: UpdateAlunoDTO = {};
  const saldoNumber = Number(form.saldo.replace(/\D/g, "")) / 100;

  if (form.nome.trim() && form.nome !== aluno.nome) dto.nome = form.nome;
    if (form.email?.trim() && form.email !== aluno.email) dto.email = form.email; // se tiver email no AlunoItem
    if (form.senha.trim()) dto.senha_hash = form.senha;
    if (cursoSel && cursoSel.id !== aluno.cursoId) dto.cursoId = cursoSel.id;
  if (!Number.isNaN(saldoNumber) && saldoNumber !== aluno.saldo) dto.saldo = saldoNumber;
  else dto.saldo = 0;

  return dto;
}