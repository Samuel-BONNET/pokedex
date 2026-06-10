<template>
  <div>
    {{ pokemon?.nameFr }}
    <img :src="pokemon?.currentSprite ?? undefined" />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id
const { data: pokemon } = await useFetch<{
  nameFr: string
  currentSprite: string | null
}>(`/api/pokemon/${id}`)
</script>