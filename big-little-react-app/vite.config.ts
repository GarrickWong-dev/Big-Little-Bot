import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/admin": "http://localhost:3000",
      "/co": "http://localhost:3000",
      "/contest": "http://localhost:3000",
    },
  },
})
