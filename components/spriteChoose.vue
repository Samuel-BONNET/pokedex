<template>
  <div style="display:flex">
    <li v-for="gamesData in props.pokemon.availableGames" :key="gamesData.game">
      <img :src="gamesData.sprite" loading="lazy" @click="selectSprite(gamesData.sprite, gamesData.game)" />
    </li>
  </div>
  <button @click="changeSprite">Sauvegarder</button>
</template>

<script setup lang="ts">

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

function selectSprite(sprite: string, game: string) {
  spriteTarget.value = sprite
  gameTarget.value = game
}

async function changeSprite() {
  if (spriteTarget.value !== null && gameTarget.value !== null) {
    const token = localStorage.getItem('token')
    let currentIdUser = 1

    if (token) {
      try {
        const userData = await $fetch<{ userId: number }>('/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        currentIdUser = userData.userId ?? 1
      } catch {
        console.warn('Failed to fetch user, saving as guest')
      }
    }

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