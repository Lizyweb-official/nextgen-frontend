import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { WebMessageProvider } from "./context/WebMessage";

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <WebMessageProvider>
      <App />  
    </WebMessageProvider>
  </StrictMode>,
)
