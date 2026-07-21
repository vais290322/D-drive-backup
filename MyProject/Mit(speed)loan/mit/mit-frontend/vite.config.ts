import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      icon: true, exportType: 'named', namedExport: 'ReactComponent',
    },
  }), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Allow specific external hostnames (e.g. Cloudflare preview domains) and
  // enable host binding so the dev server can be reached from the network.
  server: {
    host: true,
    // Allow common explicit preview hosts and any trycloudflare.com subdomain
    // by adding the suffix entry `.trycloudflare.com` which Vite will
    // accept as a host suffix in its allowedHosts checks.
    allowedHosts: [
      '.trycloudflare.com',
      'commitments-doug-citizen-revolutionary.trycloudflare.com',
      'admission-transportation-decade-undertaken.trycloudflare.com',
      'circuits-gotta-anne-comprehensive.trycloudflare.com'
    ]
  }
});

