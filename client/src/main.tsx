
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { AuthProvider } from "./context/AuthContext.tsx"
import { CartProvider } from './context/CartContext.tsx'
import { ReportProvider } from './context/ReportContext.tsx'
import App from './App.tsx'
import './index.css'

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1019984704736-3rm24fu64b448k1a6cv0t8c4njlepg8d.apps.googleusercontent.com">
      <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
        <AuthProvider>
          <CartProvider>
            <ReportProvider>
              <App />
            </ReportProvider>
          </CartProvider>
        </AuthProvider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
