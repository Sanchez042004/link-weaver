import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'seo-transform',
      transformIndexHtml(html) {
        return html.replace(/{{YEAR}}/g, new Date().getFullYear().toString())
      },
      closeBundle() {
        const sitemapPath = path.resolve(__dirname, 'dist/sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
          let sitemap = fs.readFileSync(sitemapPath, 'utf-8');
          const today = new Date().toISOString().split('T')[0];
          sitemap = sitemap.replace(/{{DATE}}/g, today);
          fs.writeFileSync(sitemapPath, sitemap);
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
