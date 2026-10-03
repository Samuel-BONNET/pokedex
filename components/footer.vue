<template>
  <footer :class="themeClassesSecondaryBackground" class="relative z-10 mt-10 w-full border-t-4 border-white/30 text-white">
    <div class="grid grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-3 lg:pl-20">
      <div class="flex flex-col gap-3">
        <NuxtLink to="/" class="flex w-fit items-center gap-3">
          <img :src="img.pokeIcon" :alt="meta.appName" class="size-10 object-contain" :class="themeClassesHue" />
          <span class="text-2xl font-bold">{{ meta.appName }}</span>
        </NuxtLink>
        <p class="text-sm opacity-90">{{ text.footer.tagline }}</p>
        <a :href="img.remote.pokeApi" target="_blank" rel="noopener noreferrer"
           class="flex w-fit items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:opacity-80">
          <Database class="size-4 shrink-0" />
          {{ text.footer.dataSource }}
        </a>
      </div>

      <div v-if="creditLines.length" class="flex flex-col gap-2">
        <p class="text-lg font-semibold">{{ credits.title || text.footer.credits }}</p>
        <ul class="flex flex-col gap-1.5">
          <li v-for="line in creditLines" :key="line" class="flex items-start gap-2 text-sm opacity-90">
            <img :src="img.pokeIcon" alt="" class="mt-0.5 size-4 shrink-0 object-contain" :class="themeClassesHue" />
            <span>{{ line }}</span>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-2 text-sm opacity-90">
        <p class="flex items-start gap-2">
          <Scale class="mt-0.5 size-4 shrink-0" />
          {{ text.footer.trademark }}
        </p>
        <p class="flex items-start gap-2">
          <AlertTriangle class="mt-0.5 size-4 shrink-0" />
          {{ text.footer.disclaimer }}
        </p>
        <p class="flex items-start gap-2">
          <Heart class="mt-0.5 size-4 shrink-0" />
          {{ text.footer.nonOfficial }}
        </p>
      </div>
    </div>

    <div class="flex flex-col items-center justify-between gap-2 border-t border-white/25 px-4 py-3 text-center text-xs lg:flex-row lg:pl-20">
      <p>{{ copyright }}</p>
      <p>{{ text.footer.builtBy }}</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { AlertTriangle, Database, Heart, Scale } from 'lucide-vue-next'
import creditsRaw from '~/credits.md?raw'

const { img, meta, text, themeClassesSecondaryBackground, themeClassesHue } = useLang()

const credits = computed(() => {
    const lines = creditsRaw.split('\n')
    return {
        title: lines.find(l => l.trim().startsWith('#'))?.replace(/^#+\s*/, '') ?? '',
        lines: lines.filter(l => l.trim() && !l.trim().startsWith('#')),
    }
})

const creditLines = computed(() => credits.value.lines)

const copyright = computed(() => text.footer.copyright.replace('{year}', String(new Date().getFullYear())))
</script>

<style scoped>

</style>
