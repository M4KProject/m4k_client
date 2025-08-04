/// <reference types="node" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(() => {
	const define: Record<string, any> = {};
	Object.entries(define).map(([k, v]) => define[k] = JSON.stringify(v));

	return {
		plugins: [preact()],
		define: define,
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				"@common": path.resolve(__dirname, './common'),
				
				// Map React imports from common library to Preact
				"react": "preact/compat",
				"react-dom": "preact/compat"
			},
		},
	}
});
