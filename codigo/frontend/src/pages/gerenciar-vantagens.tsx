import '../styles/default.css'
import '../styles/App.css'
import Header from '../components/header.tsx'
import { RootProvider } from '../providers/RootProvider'
import { useLogin } from '../hooks/useLogin'
import LoginModal from '../components/login/loginModal.tsx'
import { Navigate } from 'react-router-dom'
import { TabelaVantagensAluno, TabelaVantagensEmpresa } from '../components/vantagemTabela.tsx'

function AppContent() {
    const { loginModalOpen, isLoggedIn, hydrated, tipo } = useLogin();
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
            <div className="p-5 bg-zinc-700/80 rounded-3xl">
                <div className="space-y-4 p-5 bg-gray-800/90 border rounded-2xl border-slate-600">
                    {tipo === "Aluno" &&
                        <TabelaVantagensAluno />
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