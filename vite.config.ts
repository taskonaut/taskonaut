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
                short_name: 'Taskominator',
                theme_color: '#000000',
                icons: [
                    {
                        src: 'icon.png',
                        sizes: '200x200',
                        type: 'image/png',
                        purpose: 'any maskable',
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
