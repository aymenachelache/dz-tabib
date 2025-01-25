import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'], // Add extensions to resolve
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'), // Example alias
      '@components': path.resolve(__dirname, 'src/components'), // Example alias
    },
  },

  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist', // Specify the output directory
    sourcemap: false, // Disable source maps in production
    minify: 'terser', // Use Terser for minification
    eslint: {
      ignoreDuringBuilds: true,
    },
  },
})
