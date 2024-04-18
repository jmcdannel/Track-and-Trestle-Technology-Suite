import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist',
    },
    plugins: [react(), svgr()],
    server: {
      host: '0.0.0.0',
      port: 5100,
      proxy: {
        '^/api': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          secure: false
        }
      }
    },
  };
});