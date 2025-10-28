import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        fixtures: resolve(__dirname, "fixtures.html"),
        index: resolve(__dirname, "index.html"),
        main: resolve(__dirname, "main.html"),
        scene: resolve(__dirname, "scene.html"),
        venue: resolve(__dirname, "venue.html"),
        venues: resolve(__dirname, "venues.html"),
      },
    },
  },
  plugins: [react()],
});
