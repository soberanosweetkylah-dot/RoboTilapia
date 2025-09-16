import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "./", // make sure this points to your current project root (main)
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
  },
});
