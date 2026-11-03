import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GH_PAGES ? '/key/' : '/',
  plugins: [react()],
  server: {
    port: 5208,
    strictPort: true,
    host: '127.0.0.1',
    proxy: { '/api': 'http://127.0.0.1:8792' },
  },
})
