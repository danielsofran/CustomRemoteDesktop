/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {VitePWA} from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp('.*'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-web-app-cache',
              expiration: {
                maxEntries: 3,
                maxAgeSeconds: 60 * 60 * 24 * 7 * 4, // 4 week
                // maxAgeSeconds: 60 * 60 * 24 * 7 * 52 * 10, // 10 years
              },
            },
          }
        ],
      },
      manifest: {
        short_name: "Remote Desktop",
        name: "Remote Desktop App",
        description: "Custom Remote Desktop App for Windows. Requires a server to be running on the target machine.",
        display: "standalone",
        orientation: "portrait",
        display_override: ["standalone", "minimal-ui", "browser", "fullscreen"],
        icons: [
          {
            "src": "assets/icon/favicon.png",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
          },
          {
            "src": "assets/icon/icon.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
          }
        ],
        "start_url": ".",
        "theme_color": "#ffffff",
        "background_color": "#ffffff"
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
