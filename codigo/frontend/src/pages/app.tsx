import '../styles/default.css'
import '../styles/App.css'
import Header from '../components/header.tsx'
import { PainelTabelas } from '../components/PainelTabelas'
import { RootProvider } from '../providers/RootProvider'
import { useLogin } from '../hooks/useLogin'
import LoginModal from '../components/login/loginModal.tsx'

function AppContent() {
    const { loginModalOpen } = useLogin();
    return (
        <>
            <Header />
            {loginModalOpen && <LoginModal />}
            <PainelTabelas />
        </>
    )
}

export default function App() {
    return (
        <RootProvider>
            <AppContent/>
        </RootProvider>
    );
}