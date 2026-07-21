import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    hmr: true,
    historyApiFallback: true,
    proxy: {
      "/api":"http://localhost:6080"
      // "/api": "https://mern-stack-ecommerce-backend-1-nbca.onrender.com",
    },
  },
});
