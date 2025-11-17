import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../styles/index.css'
//import Helloworld from './helloworld.tsx'
import App from './app.tsx'
import Extrato from './extrato.tsx'
import GerenciarVantagens from './gerenciar-vantagens.tsx'
import { Background } from '../components/background.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Background />
      <Routes>
        <Route path="/" element={<App />} /> {/* Trocar */}
        <Route path="/admin/*" element={<App />} />
        <Route path="/extrato" element={<Extrato />} />
        <Route path="/gerenciar-vantagens" element={<GerenciarVantagens />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
