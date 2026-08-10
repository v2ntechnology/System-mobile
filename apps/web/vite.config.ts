import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Biblioteca de imagens da marca, na raiz do monorepo — evita duplicar arquivo.
      "@imgs": fileURLToPath(new URL("../../imgs", import.meta.url)),
    },
  },
  /* O worker do MapLibre é ESM. */
  worker: {
    format: "es",
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    // FE-04: code-splitting por rota + vendors estáveis em chunk próprio.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
