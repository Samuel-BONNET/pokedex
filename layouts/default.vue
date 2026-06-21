<script setup lang="ts">
</script>
<template>
  <div class="grid grid-cols-3">
    <h1 class="text-center m-4 col-span-3 text-6xl font-bold">POKESOULS</h1>
    <login />
    <nav class="flex justify-center gap-2 m-4 col-span-3">
      <NuxtLink to="/">Accueil</NuxtLink>
      <NuxtLink to="/pokedex">Pokedex</NuxtLink>
      <NuxtLink to="#">next one</NuxtLink>
    </nav>
    <main class="col-span-3 m-4">
      <slot />
    </main>
  </div>
</template>