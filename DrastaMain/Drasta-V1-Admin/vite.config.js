import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5175,
    strictPort: true,
    allowedHosts: [
      // 'shape-seattle-membership-forbes.trycloudflare.com',
      // 'drasta-admin.trycloudflare.com'
    ]
},
})
