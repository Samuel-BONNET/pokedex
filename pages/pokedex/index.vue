<template>
  <h1>Pokedex</h1>
  <div v-for="p in pokemons" :key="p.pokeNumber">
    <NuxtLink  :to="`/pokedex/${p.pokeNumber}`">
      <PokemonCard :pokemon="p" />
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">

const { userId } = useUser()
const { data: pokemons } = await useFetch('/api/pokemon', {
  query: { userId },
})

</script>