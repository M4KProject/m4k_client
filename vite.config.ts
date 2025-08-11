/// <reference types="node" />

import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(() => {
	const define: Record<string, any> = {};
	Object.entries(define).map(([k, v]) => define[k] = JSON.stringify(v));

	return {
		plugins: [
			preact(),
			VitePWA({
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
					runtimeCaching: [
						{
							urlPattern: /^https:\/\/fonts\.m4k\.fr\//,
							handler: 'CacheFirst',
							options: {
								cacheName: 'm4k-fonts',
							},
						},
						{
							urlPattern: /\/files\/.+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|mp4|webm|ogg|avi|mov|wmv|flv|m4v|pdf|mp3|wav|m4a|aac)$/i,
							handler: 'StaleWhileRevalidate',
							options: {
								cacheName: 'm4k-media',
								expiration: {
									maxEntries: 200,
									maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
								},
							},
						},
						{
							urlPattern: /^https:\/\/.*\.(js|css|woff|woff2|ttf|eot|json|xml)$/,
							handler: 'CacheFirst',
							options: {
								cacheName: 'm4k-external-assets',
								expiration: {
									maxEntries: 100,
									maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
								},
							},
						}
					]
				},
				manifest: {
					name: 'M4K Client',
					short_name: 'M4K',
					description: 'Multi-interface content management system',
					theme_color: '#000000',
					background_color: '#ffffff',
					display: 'standalone',
					orientation: 'any',
					scope: '/',
					start_url: '/',
					icons: [
						{
							src: '/icon-192x192.png',
							sizes: '192x192',
							type: 'image/png'
						},
						{
							src: '/icon-512x512.png',
							sizes: '512x512',
							type: 'image/png'
						}
					]
				}
			})
		],
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
