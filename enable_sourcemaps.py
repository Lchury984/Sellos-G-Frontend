#!/usr/bin/env python3
# Habilitar source maps en vite.config.js

content = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Habilitar source maps
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
})
"""

with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ vite.config.js: source maps habilitados')
