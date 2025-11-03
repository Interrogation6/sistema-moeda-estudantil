import '../styles/default.css'
import '../styles/App.css'
import Header from '../components/header.tsx'
import { RootProvider } from '../providers/RootProvider'
import { useLogin } from '../hooks/useLogin'
import LoginModal from '../components/login/loginModal.tsx'
import { TabelaExtrato } from '../components/extratoTabela.tsx'

function AppContent() {
    const { loginModalOpen } = useLogin();
    return (
        <>
            <Header />
            {loginModalOpen && <LoginModal />}
            <div className="p-5 bg-zinc-700/80 rounded-3xl">
                <div className="space-y-4 p-5 bg-gray-800/90 border rounded-2xl border-slate-600">
                    <TabelaExtrato />
                </div>
            </div>
        </>
    )
}

export default function Extrato() {
    return (
        <RootProvider>
            <AppContent />
        </RootProvider>
    );
}