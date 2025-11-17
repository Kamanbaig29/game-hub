import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7000,
    host: '0.0.0.0',
    allowedHosts: ['contact.cryptoverse.games'],
    hmr: {
      port: 443,
      host: 'contact.cryptoverse.games'
    },
    proxy: {
      '/api': {
        target: 'https://cryptoverse.games',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
