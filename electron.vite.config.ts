import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "src/renderer/src"),
        '@renderer': resolve('src/renderer/src'),
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util',
        stream: 'stream',
        events: 'events',
        path: 'path-browserify',
        crypto: 'crypto-browserify',
        os: 'os-browserify',
        url: 'url',
        querystring: 'querystring-es3',
        assert: 'assert'
      }
    },
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env': '{}'
    },
    optimizeDeps: {
      include: ['buffer', 'process']
    },
    plugins: [react(), tailwindcss()]
  }
})
