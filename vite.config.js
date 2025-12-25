// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/', // Add this for GitHub Pages - change 'portfolio' to your repo name
  root: './',
  publicDir: 'public',
  server: {
    port: 5501,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});