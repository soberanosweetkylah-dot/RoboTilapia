import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./", // make sure this points to your current project root (main)
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
  },
});
