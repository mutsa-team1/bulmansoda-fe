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
    proxy: {
      // /api 로 시작하는 요청은 백엔드로 프록시
      '/api': {
        target: 'http://3.36.117.217:8080',
        changeOrigin: true,
      },
    },
  },
})
