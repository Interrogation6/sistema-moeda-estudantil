import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus} from "lucide-react";
import ModalEditarAluno from "./alunoModal";

import '../styles/table.css';

export function ListaAluno() {
    const [ids, setIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIds() {
            try {
                const res = await fetch("http://localhost:8080/getListaAlunos");
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data: number[] = await res.json();
                setIds(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(String(err));
                }
            } finally {
                setLoading(false);
            }
        }
        fetchIds();
    }, []);

    return (
        <div className="lista-alunos">
            <h2>Lista de Alunos</h2>
            {loading && <div>Carregando...</div>}
            {error && <div style={{ color: 'red' }}>Erro: {error}</div>}
            {!loading && !error && (
                <div className="cells">
                    {ids.length === 0 && <div>Nenhum id encontrado.</div>}
                    {ids.map((id) => (
                        <div key={id} className="cell">{id}</div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function TabelaAlunos() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    type AlunoItem = {
        id: number;
        nome: string;
        email: string;
        curso: string;
        instituicao: string;
        saldo: number;
    };
    const [alunos, setAlunos] = useState<AlunoItem[]>([]);

    useEffect(() => {
        async function fetchIds() {
            try {
                const res = await fetch("http://localhost:8080/aluno/getAll");
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                setAlunos(data);
            } catch (err: unknown) {
                if (err instanceof Error)
                    setError(err.message);
                else
                    setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        fetchIds();
    })

    const [modalOpen, setModalOpen] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState<AlunoItem | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isCreate, setIsCreate] = useState(false);
    function handleCreate() {
        setAlunoSelecionado({
            id: 0,                  // id fictício, será ignorado no POST
            nome: "",
            email: "",
            curso: "",
            instituicao: "",
            saldo: 0,
        });
        setModalOpen(true);
        setIsCreate(true);
    }
    function handleEdit(aluno: AlunoItem) {
        setAlunoSelecionado(aluno);
        setModalOpen(true);
        setIsCreate(false);
    }

    function handleSaved(alunoAtualizado: AlunoItem) {
        setAlunos(prev => prev.map(a => a.id === alunoAtualizado.id ? alunoAtualizado : a));
    }

    async function handleDelete(id: number) {
        const ok = globalThis.confirm("Tem certeza que deseja excluir este aluno?");
        if (!ok) return;
        try {
            setDeletingId(id);
            const res = await fetch(`http://localhost:8080/aluno/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setAlunos(prev => prev.filter(a => a.id !== id));
        } catch (e) {
            console.error("Erro ao deletar aluno:", e);
            alert("Não foi possível excluir o aluno. Tente novamente.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 text-gray-400">
                <span>Carregando alunos...</span>
                <div role="status">
                    <svg
                        aria-hidden="true"
                        className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Carregando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                Erro ao carregar alunos: {error}
            </div>
        );
    }

    return (
        <>
            <table className="table-fixed border-collapse w-full">
                <thead className="">
                    <tr >
                        <th className="text-lg w-80">Nome</th>
                        <th className="text-lg">Curso</th>
                        <th className="text-lg">Instituição</th>
                        <th className="text-lg w-35">Saldo</th>
                        <th className="text-lg w-40"></th>
                    </tr>
                </thead>
                <tbody className="
      [&>tr:nth-child(odd)>td]:bg-gray-500/10
      [&>tr:nth-child(even)>td]:bg-gray-500/0
    ">
                    {alunos.map((aluno, i) => (
                        <tr key={i} className="hover:bg-gray-700">
                            <td className="border-r border-gray-200/10 pl-4 text-left">{aluno.nome}</td>
                            <td className="border-r border-gray-200/10">{aluno.curso}</td>
                            <td className="border-r border-gray-200/10">{aluno.instituicao}</td>
                            <td className="text-right pr-4">{aluno.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>
                                <button className="table-button me-1 mb-1 mt-1"
                                    onClick={() => handleEdit(aluno)}>
                                    <Pencil size={20} className="m-1" />
                                </button>
                                <button className="table-button me-1 mb-1 mt-1"
                                    onClick={() => handleDelete(aluno.id)}
                                    disabled={deletingId === aluno.id}>
                                    <Trash2 size={20} className="m-1" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="table-button me-1 mb-1 mt-1"
            onClick={() => handleCreate()}>
                <Plus size={24} className="m-1"/>
            </button>

            {modalOpen && alunoSelecionado && (
                <ModalEditarAluno
                    aluno={alunoSelecionado}
                    isCreate = {isCreate}
                    onClose={() => setModalOpen(false)}
                    onSaved={handleSaved}
                    onCreated={handleCreate}
                />
            )}
        </>
    );
}