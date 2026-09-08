import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  pages: true
})