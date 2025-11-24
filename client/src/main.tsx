
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { AuthProvider } from "./context/AuthContext.tsx"
import App from './App.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1019984704736-3rm24fu64b448k1a6cv0t8c4njlepg8d.apps.googleusercontent.com">
        <AuthProvider>
            <App />
        </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
