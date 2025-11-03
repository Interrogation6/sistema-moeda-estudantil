import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../styles/index.css'
//import Helloworld from './helloworld.tsx'
import App from './app.tsx'
import Extrato from './extrato.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Trocar */}
        <Route path="/admin/*" element={<App />} />
        <Route path="/extrato" element={<Extrato />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
