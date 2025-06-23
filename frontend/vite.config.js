import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',    // damit Docker-Bind funktioniert
    proxy: {
      // alles, was mit /api losgeht, wird an den Backend-Container weitergereicht
      '/api': {
        target: 'http://backend:3000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    vue(),
    tailwind(),
  ],
})
