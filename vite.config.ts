import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      react({
        include: '**/*.{tsx|ts}',
      }),
    ],
    server: {
      port: 4000,
      proxy: {
        '/api': { target: process.env.VITE_API_URL, changeOrigin: true },
      },
    },
  })
}
