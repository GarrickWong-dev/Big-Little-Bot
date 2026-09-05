import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/admin": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/co": "http://localhost:3000",
      "/contest": "http://localhost:3000",
      "/subs": "http://localhost:3000",
      "/pics": "http://localhost:3000",
      "/user": "http://localhost:3000",
      "/uata": "http://localhost:3000",
    },
  },
})
