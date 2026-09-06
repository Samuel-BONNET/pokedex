<template>
  <div class="h-[min(30vw,30rem)] max-h-[30rem] w-full flex flex-col items-center bg-white">
    <img v-if="game.currentSprite" :src="game.currentSprite" class="w-full h-full object-contain" loading="lazy" />
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
    currentSprite: string | null
  }
}>()
</script>