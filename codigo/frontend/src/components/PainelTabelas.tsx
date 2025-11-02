import '../styles/default.css'
import { useState } from "react";
import { Users, Building2 } from "lucide-react";
import { TabelaAlunos } from "../components/alunoTabela";
import { TabelaEmpresas } from './empresaTabela';

type TabKey = "alunos" | "empresas";

export function PainelTabelas() {
  const [tab, setTab] = useState<TabKey>("alunos");

  const btnBase =
    "table-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors outline-none";
  const active = "bg-blue-600 text-white";
  const idle = "bg-transparent text-gray-300 hover:bg-white/10";

  return (
    <div className="space-y-4">
        <div role="tablist" aria-label="Listas" className="flex gap-2">
          <button
            role="tab"
            aria-selected={tab === "alunos"}
            className={`${btnBase} ${tab === "alunos" ? active : idle}`}
            onClick={() => setTab("alunos")}
          >
            <Users size={16} /> Alunos
          </button>
          <button
            role="tab"
            aria-selected={tab === "empresas"}
            className={`${btnBase} ${tab === "empresas" ? active : idle}`}
            onClick={() => setTab("empresas")}
          >
            <Building2 size={16} /> Empresas parceiras
          </button>
        </div>
      <div style={{padding: '1em', backgroundColor: '#333333', marginTop: '1em', borderRadius: '20px', boxShadow: '4px 10px 20px rgba(0, 0, 0, 0.3)'}}>
        {/* Conteúdo */}
        <div className="rounded-2xl border border-white/10 p-4 bg-gray-800/40">
          {tab === "alunos" ? <TabelaAlunos /> : <TabelaEmpresas />}
        </div>
      </div>
    </div>
  );
}
