// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/portfolio/',
  root: './',
  publicDir: 'public',
  server: {
    port: 5501,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        digital: resolve(__dirname, 'pages/digital.html'),
        photography: resolve(__dirname, 'pages/photography.html'),
        graphics: resolve(__dirname, 'pages/graphics.html'),
        about: resolve(__dirname, 'pages/about.html'),
      }
    }
  }
});