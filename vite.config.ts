/// <reference types="node" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const define: Record<string, any> = {
    'import.meta.env.APK_MODE': mode === 'apk',
  };
  Object.entries(define).map(([k, v]) => (define[k] = JSON.stringify(v)));

  return {
    plugins: [
      preact(),
      mode === 'apk' ? viteSingleFile() : null,
      mode === 'apk' ?
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        })
      : null,
    ].filter(Boolean),
    define: define,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@common': path.resolve(__dirname, './common'),
        pblite: path.resolve(__dirname, './pblite/src'),
        fluxio: path.resolve(__dirname, './fluxio/src'),

        // Map React imports from common library to Preact
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
    build: {
      rollupOptions: {
        ...(mode === 'apk' ?
          {
            input: path.resolve(__dirname, 'device.html'),
          }
        : {}),
      },
    },
  };
});
