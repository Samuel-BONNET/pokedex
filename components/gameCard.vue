<template>
  <div class="w-36 flex flex-col items-center bg-white border border-slate-200 rounded-md p-2 hover:border-slate-400 transition-colors">
    <img v-if="game.currentJaquette" :src="game.currentJaquette" class="w-full aspect-square object-contain" loading="lazy" />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
defineProps<{
  game: {
    id: number
    nameEn: string
    generation:  string
    currentJaquette: string
  }
}>()
</script>