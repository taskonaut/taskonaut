import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        vue(),
        vueJsx(),
        VitePWA({
            manifest: {
                name: 'Taskominator Dev',
                short_name: 'Taskominator',
                theme_color: '#000000',
                icons: [
                    {
                        src: 'icon.png',
                        sizes: '200x200',
                        type: 'image/png',
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
