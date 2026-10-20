<template>
  <div>
    <div>
      <h1>Games</h1>
      <div class="flex flex-row gap-2 items-center">
        <h3>See all games</h3>
        <button class="w-fit px-4 py-2 text-xs font-bold bg-white text-neutral-800 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none" @click="toggle">{{ seeAllGames ? 'Hide' : 'See' }}</button>
      </div>
    </div>
    <div>
      <h1>Pokedex</h1>
      <p>{{ seeAllGames }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { seeAllGames, toggle } = useToggle()
</script>

<style scoped>

</style>