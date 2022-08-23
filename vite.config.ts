import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: '**/*.{tsx|ts}',
    }),
  ],
  server: {
    port: 4000,
    proxy: {
      '/api': { target: 'https://careapi.coronasafe.in', changeOrigin: true },
    },
  },
})
