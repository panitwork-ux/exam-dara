import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/exam-dara/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icon-192.png', 'assets/icon-512.png'],
      manifest: {
        name: 'ExamDara — ดาราวิทยาลัย',
        short_name: 'ExamDara',
        description: 'ระบบตรวจข้อสอบด้วยกล้องมือถือ โรงเรียนดาราวิทยาลัย',
        theme_color: '#C8102E',
        background_color: '#C8102E',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/exam-dara/',
        icons: [
          { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
