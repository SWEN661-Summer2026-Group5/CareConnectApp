import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service worker: registered from production builds only. In `vite dev` the
// Cache First worker would serve the precached shell back and defeat HMR, so
// test it with `npm run build && npm run preview`. Drop the PROD check to
// register everywhere.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('[sw] registration failed:', err))
  })
}
