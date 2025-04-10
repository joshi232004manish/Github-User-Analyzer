
import { createRoot } from 'react-dom/client'
import { ContextProvider } from './store/userContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <ContextProvider>
    <App />
  </ContextProvider>,
)
