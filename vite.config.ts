import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from https://h1chan.github.io/Deleted-Rush/
  base: "/Deleted-Rush/",
  build: {
    rollupOptions: {
      output: {
        // split heavy libs into long-cacheable vendor chunks
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
