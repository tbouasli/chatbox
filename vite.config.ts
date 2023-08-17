import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

import manifest from './public/manifest.json';

const manifestForPlugin: Partial<VitePWAOptions> = {
    registerType: 'prompt',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: manifest as VitePWAOptions['manifest'],
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
