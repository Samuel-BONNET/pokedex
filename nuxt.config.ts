import tailwindcss from "@tailwindcss/vite";
import lang from './data/lang.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      title: lang.meta.appName,
      link: [{ rel: 'icon', type: 'image/x-icon', href: lang.img.favicon }]
    }
  },
  devtools: { enabled: false },
  modules: [],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  pages: true
})