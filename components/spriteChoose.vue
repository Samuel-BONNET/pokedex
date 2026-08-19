<template>
  <div style="display:flex">
    <li v-for="gamesData in props.pokemon.availableGames" :key="gamesData.game">
      <img :src="gamesData.sprite" loading="lazy" @click="selectSprite(gamesData.sprite, gamesData.game)" />
    </li>
  </div>
  <button @click="changeSprite">Sauvegarder</button>
</template>

<script setup lang="ts">

import {useAuth} from "~/composables/useAuth";

export type AvailableGames = {
  game: string
  generationName: string
  generationId: number
  sprite: string
}

const props = defineProps<{
  pokemon: {
    id: number
    availableGames: AvailableGames[]
  }
}>()

const emit = defineEmits<{ saved: [] }>()

const spriteTarget = ref<string | null>(null)
const gameTarget = ref<string | null>(null)

const { isConnected, user } = useAuth()


function selectSprite(sprite: string, game: string) {
  spriteTarget.value = sprite
  gameTarget.value = game
}

async function changeSprite() {
  if (spriteTarget.value !== null && gameTarget.value !== null) {
    const currentIdUser = isConnected.value && user.value ? user.value.id : 1

    await $fetch(`/api/statut/${props.pokemon.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser,
        gameName: gameTarget.value,
      }
    })

    emit('saved')
  }
}
</script>