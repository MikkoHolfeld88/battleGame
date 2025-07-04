import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/frontend', // Output frontend build to dist/frontend
  },
  server: {
    port: 3000, // Default frontend port
  }
})
