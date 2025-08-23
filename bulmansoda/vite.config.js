import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: { // Vercel은 proxy 무시 
      '/api': {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})
