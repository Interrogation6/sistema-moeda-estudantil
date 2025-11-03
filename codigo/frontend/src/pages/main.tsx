import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../styles/index.css'
//import Helloworld from './helloworld.tsx'
import App from './app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Trocar depois */}
        <Route path="/admin/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
