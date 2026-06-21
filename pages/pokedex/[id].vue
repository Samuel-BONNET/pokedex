<template>
  <NuxtLink to="/pages/welcome">Hub</NuxtLink>
  <br>
  <NuxtLink to="/pokedex">Pokedex</NuxtLink>
  <div>
    {{ pokemon?.nameFr }}
    <img :src="pokemon?.currentSprite" />

    <button @click="isOpen = !isOpen">
      Sprite
    </button>

    <ul v-show="isOpen">
      <LazySpriteChoose v-if="pokemon" :pokemon="pokemon" @saved="onSpriteSaved" />
    </ul>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { AvailableGames } from "~/components/spriteChoose.vue";

const route = useRoute()
const id = route.params.id
const isOpen = ref(false)

const { user } = useAuth()
const { data: pokemon, refresh } = await useFetch<{
  id: number,
  nameFr: string,
  currentSprite?: string,
  idGameProvenance?: string,
  availableGames: AvailableGames[],
}>(`/api/pokemon/${id}`, {
  query: { userId: user.value?.id },
})

function onSpriteSaved() {
  refresh()
}

</script>