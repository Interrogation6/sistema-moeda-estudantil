import { useEffect, useState } from "react";

export function ListaAluno() {
    const [ids, setIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIds() {
            try {
                const res = await fetch("http://localhost:8080/getLista");
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