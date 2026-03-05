import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FitCoinApp from './FitCoinApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FitCoinApp />
  </StrictMode>,
)