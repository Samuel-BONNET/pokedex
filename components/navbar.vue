<template>
  <div class="flex justify-center items-center">
    <nav class="flex justify-center w-fit flex-wrap m-4">
      <NuxtLink class="p-3" :class="[themeClassesSecondaryBackground, currentPage === 0 ? 'bg-white' : 'text-white']" to="/">{{ text.nav.home }}</NuxtLink>
      <NuxtLink class="p-3" :class="[themeClassesSecondaryBackground, currentPage === 1 ? 'bg-white' : 'text-white']" to="/pokedex">{{ text.nav.pokedex }}</NuxtLink>
      <NuxtLink class="p-3" :class="[themeClassesSecondaryBackground, currentPage === 2 ? 'bg-white' : 'text-white']" to="/games">{{ text.nav.games }}</NuxtLink>
      <NuxtLink class="p-3" :class="[themeClassesSecondaryBackground, currentPage === 3 ? 'bg-white' : 'text-white']" to="/preferences">{{ text.nav.preferences }}</NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { text } = useLang()

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

const { themeClassesSecondaryBackground } = useLang()
</script>

<style scoped>

</style>