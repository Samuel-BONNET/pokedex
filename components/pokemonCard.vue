<template>
  <div class="flex flex-col items-center w-20">
    <!-- Update logo en custom one-->
    <img v-if="!imageLoader" src="https://i.gifer.com/4OKl.gif">
    <img :src="pokemon.currentSprite ?? undefined" loading="lazy" @load="imageLoader = true"/>
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

const imageLoader = ref(false)
</script>