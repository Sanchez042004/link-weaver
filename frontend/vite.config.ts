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
        const today = new Date().toISOString().split('T')[0];
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://knot-ly.vercel.app/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://knot-ly.vercel.app/features</loc>
    <lastmod>${today}</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`;
        
        const distPath = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
        fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapContent);
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
