<template>
  <div class="flex flex-col justify-center items-center gap-4 w-full">
    <div class="bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-center items-center gap-4 w-fit text-neutral-900 font-mono">
      <h1 class="text-6xl font-extrabold text-red-500">
        {{ error?.statusCode }}
      </h1>

      <span class="text-2xl font-bold">
        {{ errorMessage }}
      </span>

      <button @click="handleClearError" class="bg-neutral-800 text-white border-2 border-neutral-900 px-3 py-1 text-xs active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        Retour à l'accueil
      </button>


    </div>
  </div>
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