import '../styles/header.css';
import { User } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

function Header() {

    const { isLoggedIn, logout, openLogin } = useLogin();

    const btnBase = "header-btn-primary !bg-blue-800/10 hover:!text-blue-300 border border-transparent hover:border-current";

    return (
        <>
            <header>
                <div className="flex w-full mx-auto max-w-300 h-15">
                    <nav className="flex-4 w-full justify-center">
                        <img src={"/coin.png"} alt="Icone Moeda" className="icon" />
                        <h3>Sistema de Moeda Estudantil</h3>
                    </nav>
                    {!isLoggedIn && (
                    <div className="flex-1 justify-center">
                        <button className={`${btnBase}`}
                        onClick={() => openLogin('signin')}
                        >Entrar</button>

                        <span className='text-2xl text-blue-400/50'>/</span>

                        <button className={`${btnBase}`}
                        onClick={() => openLogin('signup')}
                        >Cadastrar</button>
                    </div>
                    )}
                    {isLoggedIn && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="inline-block bg-blue-800/10 rounded-full p-2">
                            <User size={24}/>
                        </div>
                        <button className="text-xl mx-2"
                        onClick={logout}
                        >Kelvyn</button>
                    </div>
                    )}
                </div>
                
            </header>
            <div style={{height: '2.5em'}}/>
        </>
    )
}
export default Header