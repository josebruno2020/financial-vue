import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'img/*'],
      manifest: {
        name: 'Cotrole Financeiro',
        short_name: 'ControleFinanciero',
        description: 'Sua vida financeira em um só lugar',
        theme_color: '#ffffff'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
