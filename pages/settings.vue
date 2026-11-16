<template>
  <div class="flex bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex-col  gap-4 w-fit mx-auto text-neutral-900 font-mono">
    <span class="text-xl font-bold mx-auto">{{ text.settings.title }}</span>

    <div>
      <EnableBtn text="See all games" :action="toggleGame" :enable="seeAllGames" />
    </div>

    <div class="flex flex-col gap-2">
      <a type="button" @click="" class="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer underline">
        Réinitiliser le pokedex
      </a>
      <a type="button" @click="" class="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer underline">
        Supprimer le compte
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { seeAllGames, toggleGame } = useToggle()
const { text } = useLang()
</script>

<style scoped>

</style>