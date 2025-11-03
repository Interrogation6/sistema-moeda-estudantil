
import { useState } from "react";
import { X } from "lucide-react";
import { useLogin } from "../../hooks/useLogin";
import { btnBase } from "../buttonBase";
import type { LoginResponse } from "../../contexts/loginContext";

export default function LoginModal() {
    //const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const { closeLogin, login } = useLogin();



    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrMsg(null);
        //setLoading(true);
        //console.log("tentando fazer login com ", email);

        if (!email || !senha) {
            setErrMsg("Preencha e-mail e senha.");
            return;
        }

        try {

            const res = await fetch("http://localhost:8080/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: email, senha }),
            });

            if (!res.ok) {
                // tenta extrair mensagem do back; se não houver, usa default
                let msg = "Erro ao autenticar. Verifique suas credenciais.";
                try {
                    const data = await res.json();
                    if (data?.message) msg = data.message;
                } catch (err: unknown) {
                    if (err instanceof Error)
                        setErrMsg(err.message);
                    else
                        setErrMsg(String(err));
                }
                throw new Error(msg);
            }

            const data: LoginResponse = await res.json();
            console.log("Login bem-sucedido:", data);
            login(data);
            closeLogin();

        } catch (err: unknown) {
            if (err instanceof Error)
                setErrMsg(err.message ?? "Falha inesperada ao fazer login.");
            else
                setErrMsg(String(err));
        } finally {
            //setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gray-800 text-white rounded-xl p-6 w-[28rem] shadow-xl relative">
                <h2 className="text-xl font-semibold mb-4">
                    Login
                </h2>
                <div className={`
                    overflow-hidden
                    transition-[max-height] duration-800
                    ${errMsg ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
                `}>
                    <div className="flex border border-red-800 text-red-400 p-2 rounded-lg mb-4">
                        <span className="flex-9">{errMsg}</span>
                        <button
                            onClick={() => setErrMsg(null)}>
                            <X size={24} className="flex-1 text-gray-800 bg-red-400/70 rounded-lg" />
                        </button>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className={`${btnBase} w-full p-1 !mt-2`}>
                        Entrar
                    </button>
                </form>

                <button aria-label="Fechar" onClick={closeLogin}
                    className="absolute top-2 right-3 w-8 h-8 inline-flex items-center justify-center
                rounded-full hover:bg-white/10 active:bg-white/15 leading-none p-0 outline-none">
                    <X size={20} />
                </button>
            </div>
        </div>
    )
}