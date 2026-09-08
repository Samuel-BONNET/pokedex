<template>
  <div class="flex justify-center items-center">
    <nav class="flex justify-center w-fit 2 m-4">
      <NuxtLink class="p-3" :class="currentPage === 0 ? 'bg-white' : 'bg-green-500 text-white'" to="/">Accueil</NuxtLink>
      <NuxtLink class="p-3" :class="currentPage === 1 ? 'bg-white' : 'bg-green-500 text-white'" to="/pokedex">Pokedex</NuxtLink>
      <NuxtLink class="p-3" :class="currentPage === 2 ? 'bg-white' : 'bg-green-500 text-white'" to="/games">Jeux</NuxtLink>
      <NuxtLink class="p-3" :class="currentPage === 3 ? 'bg-white' : 'bg-green-500 text-white'" to="/preferences">Préférences</NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const pages = [
  { to: '/', index: 0 },
  { to: '/pokedex', index: 1 },
  { to: '/games', index: 2 },
  { to: '/preferences', index: 3 },
  { to: '/login', index: 4}
]
const route = useRoute()

const currentPage = computed(() => {
  if (route.path === '/') return 0
  const match = pages.find(p => route.path.startsWith(p.to) && p.to !== '/')
  return match ? match.index : 0
})
</script>

<style scoped>

</style>