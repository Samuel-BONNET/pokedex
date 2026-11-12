import tailwindcss from "@tailwindcss/vite";
import lang from './data/lang.json'
import path from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
import fs from 'node:fs'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      title: lang.meta.appName,
      link: [{ rel: 'icon', type: 'image/x-icon', href: lang.img.favicon }]
    }
  },
  nitro: {
    bundledDependencies: [
      '@prisma/client',
      '.prisma/client'
    ],
  },
  devtools: { enabled: false },
  modules: [],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  pages: true,
  alias: {
    '.prisma/client': './node_modules/.prisma/client',
  },
})
