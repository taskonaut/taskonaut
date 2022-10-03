import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        vue(),
        vueJsx(),
        VitePWA({
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
            registerType: 'autoUpdate',
            manifest: {
                name: 'Taskominator Dev',
                description: 'The most awesome todo application',
                display: 'standalone',
                short_name: 'Taskominator',
                theme_color: '#212121',
                icons: [
                    {
                        src: 'assets/icons/icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-152x152.png',
                        sizes: '152x152',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                    {
                        src: 'assets/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable any',
                    },
                ],
            },
        }),
    ],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
