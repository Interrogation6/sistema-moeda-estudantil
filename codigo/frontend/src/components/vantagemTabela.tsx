import { useEffect, useState } from "react";
import { Info, Plus, X, ArrowDown, ArrowUp } from "lucide-react";
import QRCode from "qrcode";

import '../styles/table.css';
import ModalVantagem, { type VantagemItem } from "./vantagemModal";
import { useLogin } from "../hooks/useLogin";

type TabelaVantagensAlunoProps = {
    view?: boolean;
};

type EmailParams = {
    nome: string,
    email: string,
    imagem_url: string,
    vantagem_nome: string,
    vantagem_empresa: string,
    codigo: string,
    data: string,
    valor: number
};

async function notifVantagem(emailParams: EmailParams) {
    const claimUrl = `https://177.182.7.111:3000/vantagem/${emailParams.codigo}`;

    const qrCodeDataUrl = await QRCode.toDataURL(claimUrl, {
    width: 256,
    margin: 1,
  });

    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: "service_k7s7am8",
      template_id: "template_hbjjocm",
      user_id: "HNOUx4jWE46zEj0J7", // Public Key
      template_params: {
        ...emailParams,
        qr_code: qrCodeDataUrl, // <-- new param
        claim_url: claimUrl,    // optional: also send the URL in text
      },
    }),
  });

    if (r.ok) {
        console.log("Email enviado!");
    } else {
        const txt = await r.text();
        console.error('Erro ao enviar email:', txt);
    }
};

export function TabelaVantagensAluno({ view }: Readonly<TabelaVantagensAlunoProps>) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [vantagens, setVantagens] = useState<VantagemItem[]>([]);
    const { user, setUser } = useLogin();

    useEffect(() => {
        async function fetchIds() {
            try {
                let res;
                if(view === true && user != null)
                    res = await fetch("http://localhost:8080/aluno/" + user.id + "/vantagens");
                else
                    res = await fetch("http://localhost:8080/vantagem/getAtivos");
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                setVantagens(data);
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

    const [infoOpen, setInfoOpen] = useState(false);
    const [vantagemSelecionada, setVantagemSelecionada] = useState<VantagemItem | null>(null);

    function handleInfo(vantagem: VantagemItem) {
        setVantagemSelecionada(vantagem);
        setInfoOpen(true);
    }

    async function handleAdd(vantagem: VantagemItem) {
        if(user == null)
            return;
        if(user.saldo < vantagem.valor) {
            alert("Saldo insuficiente para reivindicar esta vantagem.");
            return;
        }
        if(!globalThis.confirm("Deseja reivindicar esta vantagem por " + vantagem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + 
        "? Seu novo saldo sera de: " + (user.saldo - vantagem.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })))
        return;
        try {
            const res = await fetch(`http://localhost:8080/aluno/${user.id}/vantagens/${vantagem.id}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        } catch (e) {
            console.error("Erro ao reivindicar vantagem:", e);
            alert("Não foi possível reivindicar vantagem. Tente novamente.");
        }
        setUser((prev) =>
          prev
            ? { ...prev, saldo: (user.saldo - vantagem.valor) }
            : prev
        );
        console.log("vai!");
        notifVantagem({
            nome: user.nome,
            email: "kelvyndantas@hotmail.com",
            codigo: vantagem.id.toString(),
            vantagem_nome: vantagem.nome,
            vantagem_empresa: vantagem.empresa,
            imagem_url: vantagem.imagem_path || "",
            data: new Date().toLocaleDateString(),
            valor: vantagem.valor
        });
        notifVantagem({
            nome: vantagem.empresa,
            email: "kelvyndantas@hotmail.com",
            codigo: vantagem.id.toString(),
            vantagem_nome: vantagem.nome,
            vantagem_empresa: vantagem.empresa,
            imagem_url: vantagem.imagem_path || "",
            data: new Date().toLocaleDateString(),
            valor: vantagem.valor
        });
    }

    

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 text-gray-400">
                <span>Carregando empresas...</span>
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
                Erro ao carregar empresas: {error}
            </div>
        );
    }

    return (
        <>
            <table className="table-fixed border-collapse w-full">
                <thead className="">
                    <tr >
                        <th className="text-lg">Nome</th>
                        <th className="text-lg">Empresa</th>
                        <th className="text-lg w-40">Valor</th>
                        <th className="text-lg w-40" />
                    </tr>
                </thead>
                <tbody className="
      [&>tr:nth-child(odd)>td]:bg-gray-500/10
      [&>tr:nth-child(even)>td]:bg-gray-500/0
    ">
                    {vantagens.map((vantagem, i) => (
                        <tr key={i} className="hover:bg-gray-700">
                            <td className="border-r border-gray-200/10 pl-4 text-left">{vantagem.nome}</td>
                            <td className="border-r border-gray-200/10">{vantagem.empresa}</td>
                            <td className="border-r border-gray-200/10">{vantagem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>
                                {!view && <button className="table-button me-1 mb-1 mt-1"
                                    onClick={() => handleAdd(vantagem)}>
                                    <Plus size={26} />
                                </button>}
                                <button className="table-button me-1 mb-1 mt-1"
                                    onClick={() => handleInfo(vantagem)}>
                                    <Info size={20} className="m-1" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {infoOpen && vantagemSelecionada && (
                <VantagemDetalhes
                    item={vantagemSelecionada}
                    onClose={() => setInfoOpen(false)}
                />
            )}
        </>
    );
}
interface ExtratoProps {
    item?: VantagemItem;
    onClose: () => void;
}
function VantagemDetalhes({ item, onClose }: ExtratoProps) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">Vantagem n.{item?.id}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Nome:</label>
                        <p className="w-full rounded-lg text-gray-200 bg-gray-00 border border-gray-600 px-3 py-2 text-left">
                            {item?.nome}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                        <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left  min-h-30">
                            {item?.descricao}</p>
                    </div>
                    {item?.imagem_path && <div>
                        <img
                                    src={item.imagem_path}
                                    alt="Pré-visualização da imagem"
                                    className="w-full max-h-100 object-contain"
                                />
                    </div>}
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Empresa</label>
                        <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left">
                            {item?.empresa}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Valor</label>
                        <p className="w-full rounded-lg text-gray-200 bg-gray-800 border border-gray-600 px-3 py-2 text-left">
                            {item?.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
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

export function TabelaVantagensEmpresa() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vantagens, setVantagens] = useState<VantagemItem[]>([]);
    const { user } = useLogin();

    useEffect(() => {
        async function fetchIds() {
            try {
                const res = await fetch("http://localhost:8080/vantagem/getAll/" + (user ? user.id : 0));
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                setVantagens(data);
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
    const [vantagemSelecionada, setVantagemSelecionada] = useState<VantagemItem | null>(null);
    const [info, setInfo] = useState(false);

    function handleCreate() {
        
        setVantagemSelecionada({
            id: 0,                  // id fictício, será ignorado no POST
            nome: "",
            descricao: "",
            valor: 0,
            empresa: user ? user.nome : "",
            empresa_id: user ? user.id : 2,
            ativo: true,
            imagem_path: "",
        });
        console.log("user.id: " + (vantagemSelecionada ? vantagemSelecionada.empresa_id: ""));
        setModalOpen(true);
        setInfo(false);
    }
    function handleInfo(vantagem: VantagemItem) {
        setVantagemSelecionada(vantagem);
        setModalOpen(true);
        setInfo(true);
    }

    function handleSaved(vantagemAtualizada: VantagemItem) {
        setVantagens(prev => prev.map(a => a.id === vantagemAtualizada.id ? vantagemAtualizada : a));
    }

    async function handleDelete(id: number) {
        const ok = globalThis.confirm("Tem certeza que deseja inativar esta vantagem?");
        if (!ok) return;
        try {
            const res = await fetch(`http://localhost:8080/vantagem/${id}`, {
                method: "PATCH",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (e) {
            console.error("Erro ao togglar vantagem:", e);
            alert("Não foi possível ativar/desativar vantagem. Tente novamente.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 text-gray-400">
                <span>Carregando empresas...</span>
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
                Erro ao carregar vantagens: {error}
            </div>
        );
    }

    return (
        <>
            <table className="table-fixed border-collapse w-full">
                <thead className="">
                    <tr >
                        <th className="text-lg">Nome</th>
                        <th className="text-lg">Empresa</th>
                        <th className="text-lg w-40">Valor</th>
                        <th className="text-lg w-40" />
                    </tr>
                </thead>
                <tbody className="
      [&>tr:nth-child(odd)>td]:bg-gray-500/10
      [&>tr:nth-child(even)>td]:bg-gray-500/0
    ">
                    {vantagens.map((vantagem, i) => (
                        <tr key={i} className="hover:bg-gray-700">
                            <td className="border-r border-gray-200/10 pl-4 text-left">{vantagem.nome}</td>
                            <td className="border-r border-gray-200/10">{vantagem.empresa}</td>
                            <td className="border-r border-gray-200/10">{vantagem.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td>
                                <button className="table-button me-1 mb-1 mt-1"
                                    onClick={() => handleInfo(vantagem)}>
                                    <Info size={20} className="m-1" />
                                </button>
                                <button
                                    className={`me-1 mb-1 mt-1 table-button ${vantagem.ativo ? '!text-red-300 hover:!text-red-400' : '!text-green-300 hover:!text-green-400'}`}
                                    onClick={() => handleDelete(vantagem.id)}>
                                    {vantagem.ativo ?
                                        <ArrowDown size={20} className="m-1" /> : <ArrowUp size={20} className="m-1" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="table-button me-1 mb-1 mt-1"
                onClick={() => handleCreate()}>
                <Plus size={24} className="m-1" />
            </button>

            {modalOpen && vantagemSelecionada && !info && (
                <ModalVantagem
                    vantagem={vantagemSelecionada}
                    onClose={() => setModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}
            {modalOpen && vantagemSelecionada && info && (
                <VantagemDetalhes
                    item={vantagemSelecionada}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}