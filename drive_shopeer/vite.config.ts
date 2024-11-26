import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permitir conexões externas
    port: 3000, // Porta que deseja utilizar
  },
})
