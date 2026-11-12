<template>
  <section class="max-w-md mx-auto px-4 py-16 font-mono">
    <div class="bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-center text-neutral-900 w-full">
      <div class="w-full bg-neutral-100 border-2 border-neutral-400 p-4 mb-6 flex flex-col items-center text-center">
        <span class="text-xs font-bold text-neutral-600 bg-neutral-200 px-3 py-0.5 border border-neutral-500 mb-2 uppercase">
          Erreur système
        </span>
        <h1 class="text-5xl sm:text-6xl font-extrabold text-red-600 tracking-wider">
          {{ error?.statusCode || 404 }}
        </h1>
      </div>

      <div class="w-full bg-white border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 mb-6 text-center">
        <p class="text-xs sm:text-sm font-bold text-neutral-800">
          {{ errorMessage || "Une erreur inattendue est survenue..." }}
        </p>
      </div>

      <button @click="handleClearError" class="w-full px-4 py-3 text-xs font-bold bg-neutral-800 text-white border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-neutral-700 flex items-center justify-center gap-2">
        <span>← Retour à l'accueil</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return "Oups ! La page que vous cherchez n'existe pas."
  }
  if (props.error?.statusCode === 500) {
    return "Erreur interne du serveur. Nous lorgnons le problème !"
  }
  return props.error?.message || "Une erreur est survenue."
})

const handleClearError = () => {
  clearError({ redirect: '/' })
}

</script>

<style scoped>

</style>