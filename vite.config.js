import { defineConfig } from 'vite'

export default defineConfig({
  base: '/mo-ink-game/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    host: true
  }
})
