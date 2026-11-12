import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Sem <StrictMode> de propósito: em dev ele duplica renders e logs,
// e aqui queremos contar re-renders com clareza.
createRoot(document.getElementById('root')!).render(<App />)
