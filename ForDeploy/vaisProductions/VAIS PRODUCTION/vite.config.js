import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws', // or 'wss' for secure WebSockets
      host: 'localhost',
      port: 5173,
    }
  },
  plugins: [react()],
  assetsInclude: ['**/*.PNG','**/*.png']
})
