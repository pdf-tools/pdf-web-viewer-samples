import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            'node_modules/@pdftools/four-heights-pdf-web-viewer/pdfwebviewer/**/*'
          ),
          dest: 'pdfwebviewer'
        },
        {
          src: path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            'node_modules/@pdftools/four-heights-pdf-web-viewer/doc/*.pdf'
          ),
          dest: ''
        },
        {
          src: path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            'static/**/*'
          ),
          dest: ''
        }
      ]
    })
  ],
  base: './',
  build: {
    outDir: 'build',
    emptyOutDir: true
  },
  server: {
    port: 4567,
    host: true
  }
});
