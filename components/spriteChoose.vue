<template>
  <div class="flex justify-center items-center w-full">
    <ul v-for="item in spriteList" :key="item.game">
      <img :src="item.sprite" loading="lazy" @click="selectSprite(item.sprite, item.game)" class="h-16 w-auto object-contain" />
    </ul>
  </div>
  <button v-if="pokemon" @click="changeSpritePoke">Sauvegarder</button>
  <button v-if="game" @click="changeSpriteGame">Sauvegarder</button>
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
  pokemon?: { id: number, availableGames: AvailableGames[] },
  game?: { id: number }
  availableJaquettes?: { name: string, sprite: string }[]
}>()

const spriteList = computed(() =>
  props.availableJaquettes?.map(j => ({ ...j, game: j.name})) ?? props.pokemon?.availableGames?.map(g => ({ sprite: g.sprite, name: g.game, game: g.game })) ?? []
)

const emit = defineEmits<{ saved: [] }>()

const spriteTarget = ref<string | null>(null)
const gameTarget = ref<string | null>(null)

const { isConnected, user } = useAuth()

function selectSprite(sprite?: string, game?: string) {
  spriteTarget.value = sprite ?? null
  gameTarget.value = game ?? null
}

async function changeSpritePoke() {
  if (spriteTarget.value !== null && gameTarget.value !== null && props.pokemon) {
    const currentIdUser = isConnected.value && user.value ? user.value.id : 1

    await $fetch(`/api/preferences/pokemon/${props.pokemon.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser,
      }
    })
    emit('saved')
  }
}

async function changeSpriteGame() {
  if (spriteTarget.value !== null && gameTarget.value !== null && props.game) {
    const currentIdUser = isConnected.value && user.value ? user.value.id : 1

    await $fetch(`/api/preferences/game/${props.game.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser,
      }
    })
    emit('saved')
  }
}
</script>