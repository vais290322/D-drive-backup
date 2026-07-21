import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], 
  // optimizeDeps: {
  //   include: ['react-quill/dist/react-quill.js', 'quill'],
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // rules: {
    //   'no-console': 'error',
    // },
  },
  // esbuild: {
  //   drop: ['console', 'debugger'],
  // },

  server: {
  host: true,
  port: 5173,
  strictPort: true,
  allowedHosts: [
    // 'shape-seattle-membership-forbes.trycloudflare.com',
    'creative-boards-quotes-productions.trycloudflare.com'
  ]
},
})
