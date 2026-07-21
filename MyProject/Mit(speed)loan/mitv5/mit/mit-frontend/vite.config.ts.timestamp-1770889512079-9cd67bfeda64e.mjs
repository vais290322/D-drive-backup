// vite.config.ts
import { defineConfig } from "file:///C:/Users/Dell/Downloads/loan/mit/mit-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Dell/Downloads/loan/mit/mit-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import svgr from "file:///C:/Users/Dell/Downloads/loan/mit/mit-frontend/node_modules/vite-plugin-svgr/dist/index.js";
import path from "path";
import { miaodaDevPlugin } from "file:///C:/Users/Dell/Downloads/loan/mit/mit-frontend/node_modules/miaoda-sc-plugin/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Dell\\Downloads\\loan\\mit\\mit-frontend";
var vite_config_default = defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
      exportType: "named",
      namedExport: "ReactComponent"
    }
  }), miaodaDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // Allow specific external hostnames (e.g. Cloudflare preview domains) and
  // enable host binding so the dev server can be reached from the network.
  server: {
    host: true,
    // Allow common explicit preview hosts and any trycloudflare.com subdomain
    // by adding the suffix entry `.trycloudflare.com` which Vite will
    // accept as a host suffix in its allowedHosts checks.
    allowedHosts: [
      ".trycloudflare.com",
      "commitments-doug-citizen-revolutionary.trycloudflare.com",
      "admission-transportation-decade-undertaken.trycloudflare.com",
      "circuits-gotta-anne-comprehensive.trycloudflare.com"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEZWxsXFxcXERvd25sb2Fkc1xcXFxsb2FuXFxcXG1pdFxcXFxtaXQtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXERlbGxcXFxcRG93bmxvYWRzXFxcXGxvYW5cXFxcbWl0XFxcXG1pdC1mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvRGVsbC9Eb3dubG9hZHMvbG9hbi9taXQvbWl0LWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgbWlhb2RhRGV2UGx1Z2luIH0gZnJvbSBcIm1pYW9kYS1zYy1wbHVnaW5cIjtcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgc3Zncih7XG4gICAgc3Znck9wdGlvbnM6IHtcbiAgICAgIGljb246IHRydWUsIGV4cG9ydFR5cGU6ICduYW1lZCcsIG5hbWVkRXhwb3J0OiAnUmVhY3RDb21wb25lbnQnLFxuICAgIH0sXG4gIH0pLCBtaWFvZGFEZXZQbHVnaW4oKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICAvLyBBbGxvdyBzcGVjaWZpYyBleHRlcm5hbCBob3N0bmFtZXMgKGUuZy4gQ2xvdWRmbGFyZSBwcmV2aWV3IGRvbWFpbnMpIGFuZFxuICAvLyBlbmFibGUgaG9zdCBiaW5kaW5nIHNvIHRoZSBkZXYgc2VydmVyIGNhbiBiZSByZWFjaGVkIGZyb20gdGhlIG5ldHdvcmsuXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IHRydWUsXG4gICAgLy8gQWxsb3cgY29tbW9uIGV4cGxpY2l0IHByZXZpZXcgaG9zdHMgYW5kIGFueSB0cnljbG91ZGZsYXJlLmNvbSBzdWJkb21haW5cbiAgICAvLyBieSBhZGRpbmcgdGhlIHN1ZmZpeCBlbnRyeSBgLnRyeWNsb3VkZmxhcmUuY29tYCB3aGljaCBWaXRlIHdpbGxcbiAgICAvLyBhY2NlcHQgYXMgYSBob3N0IHN1ZmZpeCBpbiBpdHMgYWxsb3dlZEhvc3RzIGNoZWNrcy5cbiAgICBhbGxvd2VkSG9zdHM6IFtcbiAgICAgICcudHJ5Y2xvdWRmbGFyZS5jb20nLFxuICAgICAgJ2NvbW1pdG1lbnRzLWRvdWctY2l0aXplbi1yZXZvbHV0aW9uYXJ5LnRyeWNsb3VkZmxhcmUuY29tJyxcbiAgICAgICdhZG1pc3Npb24tdHJhbnNwb3J0YXRpb24tZGVjYWRlLXVuZGVydGFrZW4udHJ5Y2xvdWRmbGFyZS5jb20nLFxuICAgICAgJ2NpcmN1aXRzLWdvdHRhLWFubmUtY29tcHJlaGVuc2l2ZS50cnljbG91ZGZsYXJlLmNvbSdcbiAgICBdXG4gIH1cbn0pO1xuXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVVLFNBQVMsb0JBQW9CO0FBQ3BXLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxVQUFVO0FBRWpCLFNBQVMsdUJBQXVCO0FBTGhDLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsS0FBSztBQUFBLElBQ3RCLGFBQWE7QUFBQSxNQUNYLE1BQU07QUFBQSxNQUFNLFlBQVk7QUFBQSxNQUFTLGFBQWE7QUFBQSxJQUNoRDtBQUFBLEVBQ0YsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0FBQUEsRUFDckIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlOLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
