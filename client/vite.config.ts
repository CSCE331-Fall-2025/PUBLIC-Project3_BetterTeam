import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    //Prevents “Invalid hook call” errors and Ensures only one React instance is used in the bundle
    dedupe: ['react', 'react-dom']
  }
})
