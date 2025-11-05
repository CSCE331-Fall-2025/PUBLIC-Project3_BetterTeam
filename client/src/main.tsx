import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import ServerAppetizer from './ServerAppetizer.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServerAppetizer />
  </StrictMode>,
)
