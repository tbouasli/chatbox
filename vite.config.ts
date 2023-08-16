import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: 'prompt',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
        name: 'Chat Box',
        short_name: 'Chat Box',
        description: 'An app to chat with your friends',
        icons: [
            {
                src: '/android-icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
                purpose: 'apple touch icon',
            },
            {
                src: '/ms-icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
                purpose: 'any maskable',
            },
        ],
        theme_color: '#171717',
        background_color: '#e8ebf2',
        display: 'standalone',
        scope: '/',
        start_url: '/app',
        orientation: 'portrait',
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin)],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
