import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

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
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      manifest: {
        name: "DMXY",
        short_name: "DMXY",
        description: "Run DMX lights",
      },
      workbox: {
        ignoreURLParametersMatching: [/.*/],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [
          /\/fixtures/,
          /\/main/,
          /\/scene/,
          /\/venue/,
          /\/venues/,
        ],
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg}",
          "fixtures.html",
          "index.html",
          "main.html",
          "scene.html",
          "venue.html",
          "venues.html",
        ],
      },
    }),
  ],
});
