import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster/>
    <App />
  </BrowserRouter>,
)
