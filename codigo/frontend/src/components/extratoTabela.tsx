import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import '../styles/table.css';
import { useLogin } from "../hooks/useLogin";
import { X } from "lucide-react"
import { baseUrl } from "../Params";

export function ListaExtrato() {
    const { user } = useLogin();
    const [ids/* , setIds */] = useState<number[]>([]);
    const [loading/* , setLoading */] = useState(true);
    const [error/* , setError */] = useState<string | null>(null);

    return (
        <div className="lista-extrato">
            <h2>Extrato de {user?.nome}</h2>
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
export type ExtratoItem = {
    id?: number;
    remetente?: { id: number; nome: string } | null;
    destinatario?: { id: number; nome: string } | null;
    valor: number;
    dataHora?: string | null; // ISO string from backend
    vantagem?: { id?: number; nome: string; descricao?: string } | null;
};

export function TabelaExtrato() {
    const { user } = useLogin();
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [itemSelecionado, setItemSelecionado] = useState<ExtratoItem | null>(null);
    const [extrato, setExtrato] = useState<ExtratoItem[]>([]);


    function viewDetalhes(item: ExtratoItem) {
        setItemSelecionado(item);
        setModalOpen(true);
    }

    function formatExtratoDisplay(e: ExtratoItem) {
        const vant = e.vantagem;
        const remet = e.remetente;
        const dest = e.destinatario;
        let resumo = '';
        if (vant) resumo = `Reivindicou vantagem: ${vant.nome}`;
        else if (remet && dest) {
            if (user && remet.id === user.id) resumo = `Envio para ${dest.nome}`;
            else resumo = `Recebido de ${remet.nome}`;
        } else if (remet) resumo = `Operação: ${remet.nome}`;
        else resumo = '';

        const detalhes = vant?.descricao ?? (vant ? vant.nome : `${remet?.nome ?? ''} -> ${dest?.nome ?? ''}`) ?? '';
        const quantia = Number(e.valor ?? 0);
        const date = e.dataHora ? new Date(e.dataHora) : new Date();
        return { resumo, detalhes, quantia, date } as const;
    }



    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!user) {
                if (mounted) {
                    setExtrato([]);
                    setLoading(false);
                }
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(baseUrl + `/aluno/${user.id}/extratos`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!mounted) return;

                const items: ExtratoItem[] = Array.isArray(data) ? data : [];
                setExtrato(items);
                setLoading(false);
            } catch (err: unknown) {
                console.error('Erro ao carregar extrato', err);
                if (mounted) {
                    const message = err instanceof Error ? err.message : String(err);
                    setError(message);
                    setLoading(false);
                }
            }
        }
        load();
        return () => { mounted = false; };
    }, [user]);
    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 text-gray-400">
                <span>Carregando extrato...</span>
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
                Erro ao carregar extrato: {error}
            </div>
        );
    }

    return (
        <>
            <table className="table-fixed border-collapse w-full">
                <thead className="">
                    <tr >
                        <th className="text-lg w-80">Resumo</th>
                        <th className="text-lg">Quantia</th>
                        <th className="text-lg">Data efetuada</th>
                        <th className="text-lg w-25"></th>
                    </tr>
                </thead>
                <tbody className="
      [&>tr:nth-child(odd)>td]:bg-gray-500/10
      [&>tr:nth-child(even)>td]:bg-gray-500/0
    ">
                    {extrato.map((entry, i) => {
                        const d = formatExtratoDisplay(entry);
                        return (
                            <tr key={i} className="hover:bg-gray-700">
                                <td className="border-r border-gray-200/10 pl-4 text-center">{d.resumo}</td>
                                <td className="border-r border-gray-200/10">{d.quantia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className="border-r border-gray-200/10">{d.date.toLocaleDateString("pt-BR")}</td>
                                <td>
                                    <button className="table-button me-1 mb-1 mt-1"
                                        onClick={() => viewDetalhes(entry)}>
                                        <Info size={20} className="m-1" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr key="100">
                        <td className="border-r border-gray-200/10 font-bold">Saldo Atual: </td>
                        <td className="border-r border-gray-200/10 font-bold">{user?.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td className="border-r border-gray-200/10"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            {modalOpen && itemSelecionado && (
                <ExtratoDetalhes
                    item={itemSelecionado}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}
interface ExtratoProps {
    item?: ExtratoItem;
    onClose: () => void;
}
function ExtratoDetalhes({ item, onClose }: ExtratoProps) {
    function formatExtratoDisplayLocal(e: ExtratoItem) {
        const vant = e.vantagem;
        const remet = e.remetente;
        const dest = e.destinatario;
        let resumo = '';
        if (vant) resumo = `Reivindicou vantagem: ${vant.nome}`;
        else if (remet && dest) {
            resumo = `Operação: ${remet.nome} -> ${dest.nome}`;
        } else if (remet) resumo = `Operação: ${remet.nome}`;
        const detalhes = vant?.descricao ?? (vant ? vant.nome : `${remet?.nome ?? ''} -> ${dest?.nome ?? ''}`) ?? '';
        const quantia = Number(e.valor ?? 0);
        const date = e.dataHora ? new Date(e.dataHora) : new Date();
        return { resumo, detalhes, quantia, date } as const;
    }
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Detalhes de Extrato</h2>

                <div className="space-y-4">
                    <div>
                            <label className="block text-sm text-gray-300 mb-1">Resumo:</label>
                        <p className="w-full rounded-lg text-gray-200 bg-gray-00 border border-gray-600 px-3 py-2 text-center">
                            {item ? formatExtratoDisplayLocal(item).resumo : ''}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Detalhes</label>
                            <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left  min-h-30">
                            {item ? formatExtratoDisplayLocal(item).detalhes : ''}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Quantia</label>
                            <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left">
                            {item ? formatExtratoDisplayLocal(item).quantia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Data Efetuada</label>
                            <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left">
                            {item ? formatExtratoDisplayLocal(item).date.toLocaleDateString("pt-BR") : ''}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button className="table-button px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600" onClick={onClose}>Voltar</button>
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