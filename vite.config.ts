import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor_react: ['react', 'react-dom'],
            vendor_lucide: ['lucide-react'],
            vendor_motion: ['framer-motion'],
            vendor_pdf: ['jspdf', 'html2canvas'],
          },
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || 'asset';
            if (name.endsWith('.css')) return 'assets/css/[name]-[hash][extname]';
            if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(name)) return 'assets/img/[name]-[hash][extname]';
            if (/\.(woff2?|ttf|eot)$/i.test(name)) return 'assets/fonts/[name]-[hash][extname]';
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
