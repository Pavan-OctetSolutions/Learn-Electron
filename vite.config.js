import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

// Needed for Electron + Vite
export default defineConfig({
  plugins: [react()],
  root: '.',         
  base: './',        
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
