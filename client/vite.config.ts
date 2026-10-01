import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// ESM-compatible __dirname replacement
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the client directory
    const env = loadEnv(mode, process.cwd(), '');

    // Backend URL configured in .env (e.g., VITE_API_URL or BACKEND_URL) with fallback
    const backendUrl = env.VITE_API_URL || env.BACKEND_URL || 'http://localhost:5000';

    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': `${__dirname}src`,
            },
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: backendUrl,
                    changeOrigin: true,
                },
                '/socket.io': {
                    target: backendUrl,
                    changeOrigin: true,
                    ws: true, // proxy WebSocket connections too
                },
            },
        },
    };
});
