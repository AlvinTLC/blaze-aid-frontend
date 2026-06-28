import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TanStack Router plugin MUST run before react() so route trees generate first
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendor libs into their own cacheable chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('/d3-') || id.includes('victory')) {
              return 'recharts'
            }
            if (id.includes('framer-motion') || id.includes('/motion-')) {
              return 'motion'
            }
            if (
              id.includes('/three/') ||
              id.includes('three/') ||
              id.includes('@react-three')
            ) {
              return 'three'
            }
          }
          return undefined
        },
      },
    },
  },
})
