// Merge this into your existing vite.config.js
//   npm i -D vite-plugin-pwa
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: 'NearMet',
        short_name: 'NearMet',
        description: 'Find people nearby to experience things you love.',
        theme_color: '#2A1D45',
        background_color: '#E4E6EE',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell + local images are cached; Supabase/API calls are never cached.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallbackDenylist: [/^\/api/, /supabase\.co/],
        runtimeCaching: [
          { urlPattern: /\/places\/.*\.(png|jpg|jpeg|webp|avif)$/i, handler: 'CacheFirst',
            options: { cacheName: 'place-photos', expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 30 } } },
        ],
      },
    }),
  ],
})
