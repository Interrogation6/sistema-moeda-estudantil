import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { baseUrl } from "../Params";

type EmpresaItem = { id: number; nome: string; email: string; };
type FormEmpresa = { nome: string; email: string; senha: string; };
type UpdateEmpresaDTO = Partial<{nome: string; login: string; senha_hash: string;}>;

interface ModalEditarEmpresaProps {
    empresa?: EmpresaItem ;
    isCreate?: boolean;
    onClose: () => void;
    onSaved: (empresaAtualizada: EmpresaItem) => void;
    onCreated?: (novaEmpresa: EmpresaItem) => void;
}

export default function ModalEditarEmpresa({ empresa, isCreate = false, onClose, onSaved }: ModalEditarEmpresaProps) {

    const [form, setForm] = useState<FormEmpresa>(() => ({
        nome: empresa?.nome ?? "",
        email: empresa?.email ?? "",
        senha: "",
    }));

    useEffect(() => {
        async function fetchLookups() {

            if (!empresa || isCreate) return;

            setForm(f => ({
                ...f,
                nome: empresa.nome,
                email: empresa.email,
            }));
        }

        fetchLookups();
    }, [empresa]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">{isCreate ? "Nova Empresa" : "Editar Empresa"}</h2>

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
                        <label className="block text-sm text-gray-300 mb-1">Login</label>
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
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button className="table-button px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Cancelar</button>
                    <button className="table-button px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                        disabled={!form.nome || !form.email}
                    onClick={() => {if(!empresa) return;
                        Salvar(form, empresa, onSaved, onClose, isCreate)}}>Salvar</button>
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
    form: FormEmpresa,
    empresa: EmpresaItem,
    onSaved: (empresa: EmpresaItem) => void,
    onClose: () => void,
    isCreate: boolean
) {

    const payload = buildPayloadParcial(empresa, form/* , isCreate */);

    if (Object.keys(payload).length === 0) {
        onClose(); // nada mudou
        return;
    }
    if (form.senha.length < 4) {
        globalThis.alert("Senha possui deve possuir no minimo 4 caracteres.");
        return;
    }
    if (form.senha && !isCreate) {
        if (!globalThis.confirm("Campo 'Senha' possui valor. Aplicar alteração de senha?")) {
            return;
        }
    }
    try {
        let res;
        if(isCreate){
            res = await fetch(baseUrl + `/empresa`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        } else {
            res = await fetch(baseUrl + `/empresa/${empresa.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const alunoAtualizado: EmpresaItem = {
            ...empresa,
            nome: form.nome,
            email: empresa.email,
        };

        onSaved(alunoAtualizado);
        onClose();
    } catch (err) {
        console.error("Erro ao salvar aluno:", err);
    }
}
function buildPayloadParcial(
  empresa: EmpresaItem,
  form: FormEmpresa,
    /* isCreate?: boolean, */
): UpdateEmpresaDTO {
  const dto: UpdateEmpresaDTO = {};

  if (form.nome.trim() && form.nome !== empresa.nome) dto.nome = form.nome;
    if (form.email.trim() && form.email !== empresa.email) dto.login = form.email;
    if (form.senha.trim() && form.senha) dto.senha_hash = form.senha;

  return dto;
}