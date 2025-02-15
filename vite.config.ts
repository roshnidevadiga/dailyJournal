import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/dailyJournal/',  // Always use this base for GitHub Pages
})
