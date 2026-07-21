import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
    miaodaDevPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 9856,
    // Fail if the port is already in use instead of trying another one.
    strictPort: true,
    // Allow external hosts. Prefer explicit list for security. You can also
    // set VITE_ALLOWED_HOSTS as a comma-separated env var if you need to
    // change this at runtime (example: VITE_ALLOWED_HOSTS=collage.vaisacademy.com).
    allowedHosts: process.env.VITE_ALLOWED_HOSTS
      ? process.env.VITE_ALLOWED_HOSTS.split(',').map((h) => h.trim())
      : [
          'collage.vaisacademy.com',
          'localhost',
          '127.0.0.1',
        ],
    // HMR may need an explicit host when accessed remotely (set via env var)
    hmr: {
      host: process.env.VITE_HMR_HOST || process.env.HMR_HOST || undefined,
      protocol: process.env.VITE_HMR_PROTOCOL || undefined,
      port: process.env.VITE_HMR_PORT ? Number(process.env.VITE_HMR_PORT) : undefined,
    },
  },
});
