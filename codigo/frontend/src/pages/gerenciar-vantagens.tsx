import '../styles/default.css'
import '../styles/App.css'
import Header from '../components/header.tsx'
import { RootProvider } from '../providers/RootProvider'
import { useLogin } from '../hooks/useLogin'
import LoginModal from '../components/login/loginModal.tsx'
import { Navigate, useParams } from 'react-router-dom'
import { TabelaVantagensAluno, TabelaVantagensEmpresa } from '../components/vantagemTabela.tsx'
import { useState, useEffect } from 'react'
import { Building2, Users } from 'lucide-react'

function AppContent() {
    const { loginModalOpen, isLoggedIn, hydrated, tipo } = useLogin();
    const [view, setView] = useState(true);
    const { id } = useParams<{ id?: string }>();

    const btnBase =
    "table-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors outline-none";
    const active = "!bg-blue-600/10 !text-white";
    const idle = "bg-transparent text-gray-300 hover:bg-white/10";
    

    useEffect(() => {
        if (id) setView(false);
    }, [id]);

    // Aguarda o provider hidratar (ler localStorage) antes de decidir redirecionar
    if (!hydrated) {
        return <a>pao</a>;
    }
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }
    return (
        <>
            <Header />
            {loginModalOpen && <LoginModal />}
            <div role="tablist" aria-label="Listas" className="flex gap-2 m-4">
                <button
                    role="tab"
                    aria-selected={view === true}
                    className={`${btnBase} ${view === true ? active : idle}`}
                    onClick={() => setView(true)}
                >
                    <Users size={16} /> Minhas Vantagens
                </button>
                <button
                    role="tab"
                    aria-selected={view === false}
                    className={`${btnBase} ${ view === false ? active : idle}`}
                    onClick={() => setView(false)}
                >
                    <Building2 size={16} /> Vantagens Disponíveis
                </button>
            </div>
            <div className="p-5 bg-zinc-700/80 rounded-3xl">
                {tipo === "Aluno" && (view ? 
                <h2 className="text-left font-bold px-5 pb-4 text-xl">Minhas Vantagens</h2>:
                <h2 className="text-left font-bold px-5 pb-4 text-xl">Vantagens Disponíveis</h2>)
                }
                {tipo === "Empresa" &&
                <h2 className="text-left font-bold px-5 pb-4 text-xl">Lista de Vantagens</h2>
                }
                <div className="space-y-4 p-5 bg-gray-800/90 border rounded-2xl border-slate-600">
                    {tipo === "Aluno" &&
                        <TabelaVantagensAluno view={view} openId={id ? Number(id) : undefined} />
                    }
                    {tipo === "Empresa" &&
                        <TabelaVantagensEmpresa />}
                </div>
            </div>
        </>
    )
}

export default function GerenciarVantagens() {
    return (
        <RootProvider>
            <AppContent />
        </RootProvider>
    );
}