import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const proxyTargets = {
  '/api': {
    target: process.env.VITE_API_URL ?? 'http://localhost:3001',
    changeOrigin: true,
  },
  '/uploads': {
    target: process.env.VITE_API_URL ?? 'http://localhost:3001',
    changeOrigin: true,
  },
  '/healthcheck': {
    target: process.env.VITE_API_URL ?? 'http://localhost:3001',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  server: {
    port: 5173,
    proxy: proxyTargets,
  },
  preview: {
    port: 5173,
    proxy: proxyTargets,
  },
})