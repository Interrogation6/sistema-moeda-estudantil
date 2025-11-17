import '../styles/header.css';
import { User } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEnvioMoeda from './envioMoedaModal';

function Header() {

    const { user, displayName, isLoggedIn, logout, openLogin } = useLogin();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [enviar, setEnviar] = useState(false);

    const btnBase = "header-btn-primary !bg-blue-800/10 hover:!text-blue-300 border border-transparent hover:border-current";
    const dropdownItem = "block w-full text-left px-6 py-3 text-base leading-5 hover:bg-white/5 focus:bg-white/10 focus:outline-none";

    return (
        <>
            <header>
                <div className="flex w-full mx-auto max-w-300 h-15">
                    <nav className="flex-4 w-full justify-center cursor-pointer" onClick={() => navigate("/")}>
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
                        <div className="flex-1 flex items-center justify-center relative">
                            <button
                                className="flex items-center justify-center h-full"
                                onClick={() => setIsMenuOpen(prev => !prev)}
                            >
                                <div className="inline-block bg-blue-800/10 rounded-full p-2">
                                    <User size={24} />
                                </div>
                                <span className="text-xl mx-2">{user ? displayName : "null"}</span>
                            </button>

                            <div
                                role="menu"
                                className={[
                                    "absolute inset-x-0 top-full w-full z-50",
                                    "rounded-b-xl border border-white/10 bg-neutral-800 backdrop-blur",
                                    "shadow-lg ring-1 ring-black/5 overflow-hidden",
                                    "origin-top transition duration-300 ease-out",
                                    isMenuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-y-0 pointer-events-none",
                                ].join(" ")}
                            >
                                {user?.tipo === "Aluno" &&
                                    <>
                                <button
                                    role="menuitem"
                                    className={`${dropdownItem} py-5 border-b-1 border-white/10`}
                                    onClick={() => {
                                        navigate("/extrato");
                                        setIsMenuOpen(false);
                                    }}
                                    >Moedas: <strong>{user?.saldo ? user.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}</strong></button>
                                <button
                                    role="menuitem"
                                            className={`${dropdownItem} border-b-1 border-white/10`}
                                            onClick={() => {
                                                navigate("/gerenciar-vantagens");
                                                setIsMenuOpen(false);
                                            }}
                                        >Vantagens</button>
                                    </>
                                }
                                {user?.tipo === "Empresa" && <button
                                    role="menuitem"
                                    className={`${dropdownItem} border-b-1 border-white/10`}
                                    onClick={() => {
                                        navigate("/gerenciar-vantagens");
                                        setIsMenuOpen(false);
                                    }}
                                >Gerenciar Vantagens</button>}
                                {(user?.tipo === "Aluno" || user?.tipo === "Professor") && <button
                                    role="menuitem"
                                    className={`${dropdownItem} border-b-1 border-white/10`}
                                    onClick={() => {
                                        setEnviar(true);
                                        setIsMenuOpen(false);
                                    }}
                                >Enviar Moedas</button>}
                                <button
                                    role="menuitem"
                                    className={`${dropdownItem}`}
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                >Sair</button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <div style={{height: '2.5em'}}/>

            {enviar && (
                <ModalEnvioMoeda
                    onClose={() => setEnviar(false)} />
            )}
        </>
    )
}
export default Header