import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',

  build: {
    // Matches: output.path
    outDir: 'dist',
    emptyOutDir: true,

    // Prevent absolute /assets paths (important for Drupal)
    base: '',

    rollupOptions: {
      // Matches: entry: './src/index.js'
      input: path.resolve(__dirname, 'src/index.js'),

      output: {
        // Matches: filename: 'main.js'
        entryFileNames: 'main.js',

        // Equivalent to LimitChunkCountPlugin({ maxChunks: 1 })
        manualChunks: () => 'main',

        // Keep filenames predictable
        chunkFileNames: 'main.js',
        assetFileNames: '[name].[ext]',
        format: 'es',
      },
    },

    // Matches: mode: 'production'
    minify: 'esbuild',

    // Ensure compatibility in Drupal environments
    target: 'es2018',

    // Extra safety: avoid CSS splitting into multiple files
    cssCodeSplit: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  define: {
    // Webpack used to polyfill this automatically
    'process.env': {},
  },
})