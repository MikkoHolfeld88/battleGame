import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log(env)
  return {
    base: './',
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  }
})
