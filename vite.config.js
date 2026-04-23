import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Wir nutzen public/manifest.json — Plugin generiert keinen eigenen Manifest
      manifest: false,
      // Service Worker registriert sich automatisch und aktualisiert sich im Hintergrund
      registerType: 'autoUpdate',
      workbox: {
        // Diese Dateitypen werden beim Build gecacht → App läuft offline
        globPatterns: ['**/*.{js,css,html,png,webp,svg,ico,woff2}'],
        // Icons können groß sein (Logo etc.) → Limit auf 5 MiB erhöht
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // /icons/-Pfade nicht als Navigate-Fallback behandeln → immer frisch laden
        navigateFallbackDenylist: [/\/icons\//],
        // Neuer Service Worker übernimmt sofort ohne Browser-Neustart
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  server: {
    host: true,  // lokales Netzwerk erreichbar (npm run dev)
  },
})
