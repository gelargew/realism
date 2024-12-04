import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <main style={{
      width: '100vw',
      height: '100vh',
    }}>
    <App />
    </main>
  </StrictMode>,
)
