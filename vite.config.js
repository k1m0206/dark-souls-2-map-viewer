import { miniappManifest } from '@heybox/hb-sdk/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const path = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(({ command }) => ({
  base: './',
  publicDir: 'public-lite',
  plugins: [
    react(),
    tailwindcss(),
    miniappManifest(),
    ...(command === 'serve' ? [{
      name: 'dev-runtime-gate-auto-unlock',
      enforce: 'post',
      transformIndexHtml(html) {
        let clean = html.replace(/<script\b[^>]*data-heybox-runtime-gate-bootstrap[^>]*>[\s\S]*?<\/script>/gi, '');
        clean = clean.replace(/<style\b[^>]*data-heybox-runtime-gate-style[^>]*>[\s\S]*?<\/style>/gi, '');
        clean = clean.replace(/<script\b[^>]*type=["']text\/heybox-runtime-gated["'][^>]*><\/script>/gi, (tag) => {
          const srcMatch = tag.match(/data-heybox-runtime-gate-src=["']([^"']+)["']/);
          const typeMatch = tag.match(/data-heybox-runtime-gate-type=["']([^"']+)["']/);
          const src = srcMatch ? srcMatch[1] : '';
          const type = typeMatch ? typeMatch[1] : 'module';
          return `<script type="${type}" src="${src}"></script>`;
        });
        clean = clean.replace(/<link\b[^>]*rel=["']heybox-runtime-gated-modulepreload["'][^>]*>/gi, (tag) => {
          const hrefMatch = tag.match(/data-heybox-runtime-gate-modulepreload=["']([^"']+)["']/);
          const href = hrefMatch ? hrefMatch[1] : '';
          return `<link rel="modulepreload" href="${href}">`;
        });
        return clean;
      }
    }] : [])
  ],
  resolve: {
    alias: {
      'gl-matrix': path('./node_modules/gl-matrix/esm/index.js')
    }
  },
  server: {
    host: '127.0.0.1'
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500
  }
}));
