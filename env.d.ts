/// <reference types="vite/client" />
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate'
        })
    ]
})