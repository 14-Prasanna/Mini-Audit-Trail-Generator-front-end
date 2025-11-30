import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "Mini-Audit-Trail-Generator-front-end",   // ⬅️ Mandatory for GitHub Pages routing
  optimizeDeps: {
    exclude: ["lucide-react"],
  }
});
