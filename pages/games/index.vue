<template>

  <section class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Games
    </h1>

    <p class="text-lg">
      Gérez vos sauvegardes ici<br>
      Choississez un jeu
    </p>
  </section>

  <div class="w-full mx-auto">
    <div class="flex flex-wrap justify-center gap-4">
      <div v-for="g in filteredGames" :key="g.id" class="shrink-0">
        <NuxtLink class="block" :to="`/games/${g.id}`">
          <GameCard :game="g" />
        </NuxtLink>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
const { user } = useAuth()
const { data: games } = await useFetch('/api/games', {
  query: { userId: user.value?.id }
})
const filteredGames = computed(() => (games.value ?? []).filter(g => g.currentSprite))
</script>

<style scoped>

</style>