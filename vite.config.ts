import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import removeConsole from 'vite-plugin-remove-console';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    server: { https: true },
    plugins: [
        mkcert(),
        vue(),
        vueJsx(),
        VitePWA({
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern:
                            /^https:\/\/taskonaut\.vercel\.app\/assets\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'taskonaut-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            registerType: 'prompt',
            manifest: {
                name: 'taskonaut',
                description: 'The most awesome todo application',
                display: 'standalone',
                short_name: 'taskonaut',
                theme_color: '#212121',
                background_color: '#1a1a1a',
                id: 'taskonaut',
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
                shortcuts: [
                    {
                        name: 'Tasks for today',
                        short_name: 'Today',
                        description: 'Tasks that are planned for today',
                        url: '/today',
                        icons: [
                            {
                                src: 'assets/icons/icon-192x192.png',
                                sizes: '192x192',
                            },
                        ],
                    },
                    {
                        name: 'Upcoming tasks',
                        short_name: 'Upcoming',
                        description: 'Upcoming tasks for the next 7 days',
                        url: '/upcoming',
                        icons: [
                            {
                                src: 'assets/icons/icon-192x192.png',
                                sizes: '192x192',
                            },
                        ],
                    },
                    {
                        name: 'Expired tasks',
                        short_name: 'expired',
                        description: 'Expired tasks',
                        url: '/expired',
                        icons: [
                            {
                                src: 'assets/icons/icon-192x192.png',
                                sizes: '192x192',
                            },
                        ],
                    },
                ],
            },
        }),
        removeConsole(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
