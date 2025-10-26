import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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
            {error && <div style={{color: 'red'}}>Erro: {error}</div>}
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
  const alunos = [
    { nome: "Ana Souza", curso: "Engenharia Elétrica", escola: "UFMG", saldo: 120.50 },
    { nome: "Carlos Lima", curso: "Computação", escola: "USP", saldo: 85.00 },
    { nome: "Marina Torres", curso: "Design", escola: "PUC Minas", saldo: 200.00 },
  ];

  return (
    <table className="table-fixed border-collapse w-full">
    <thead className="">
        <tr >
        <th className="text-lg w-80">Nome</th>
        <th className="text-lg">Curso</th>
        <th className="text-lg">Escola</th>
        <th className="text-lg w-35">Saldo</th>
        <th className="text-lg w-40">Ações</th>
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
            <td className="border-r border-gray-200/10">{aluno.escola}</td>
            <td className="border-r border-gray-200/10">{"R$ " + aluno.saldo.toFixed(2)}</td>
            <td className="">
            <button className="me-1 mb-1 mt-1">
                <Pencil size={20} className="m-1"/>
            </button>
            <button className="me-1 mb-1 mt-1">
                <Trash2 size={20} className="m-1"/>
            </button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>
  );
}