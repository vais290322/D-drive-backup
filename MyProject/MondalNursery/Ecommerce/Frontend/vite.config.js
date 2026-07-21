import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6081,
    host: "0.0.0.0",
    open: true,
    hmr: true,
    historyApiFallback: true,
    proxy: {
      "/api":"http://localhost:6084",
    },
  },
});
