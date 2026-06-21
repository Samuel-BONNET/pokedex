<template>
  <div>
    <img :src="pokemon.currentSprite ?? undefined" loading="lazy"/>
    <p>{{ pokemon.nameFr }}</p>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
const props = defineProps<{
  pokemon: {
    id: number
    nameFr: string
    pokeNumber: number
    currentSprite: string | null
  }
}>()
</script>