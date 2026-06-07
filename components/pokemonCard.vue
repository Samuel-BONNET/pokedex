<template>
  <div>
    <img :src="pokemon.currentSprite" />
    <p>{{ pokemon.nameFr }}</p>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
defineProps<{
  pokemon: {
    nameFr: string
    currentSprite: string
    pokeNumber: number
  }
}>()
</script>