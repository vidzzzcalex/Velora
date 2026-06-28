import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    host: true,
    open: false,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    cssMinify: true,
    cssCodeSplit: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
  css: {
    devSourcemap: false,
  },
});
