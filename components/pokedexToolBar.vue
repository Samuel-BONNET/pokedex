<template>
  <div class="flex flex-wrap gap-2 justify-center mb-3 items-center">
    <button @click="$emit('update:selectionMode', !selectionMode)" :class="selectionMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-800 border-slate-300'"
    class="px-3 py-1 text text-sm border rounded hover:bg-slate-200 hover:text-black transition-colors">
      {{ selectionMode ? 'Quitter la sélection' : 'Sélectionner'}}
    </button>
    <span v-if="selectionMode && selectedPokemons.length > 0" class="text-sm text-slate-600">
      {{ selectedPokemons.length }} sélectionné(s)
    </span>
  </div>

  <div v-if="selectionMode" class="flex flex-wrap gap-2 justify-center mb-3 items-center">
    <button @click="empty" class="px-3 py-1 text text-sm border rounded hover:bg-slate-200 transition-colors">Non Possédé</button>
    <button @click="normal" class="px-3 py-1 text text-sm border rounded hover:bg-slate-200 transition-colors">Possédé</button>
    <button @click="shiny" class="px-3 py-1 text text-sm border rounded hover:bg-slate-200 transition-colors">Shiny</button>
  </div>
</template>


<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

const props = defineProps<{
  selectedPokemons: number[]
  selectionMode: boolean
}>()

const emit = defineEmits<{
  'update:selectionMode': [value: boolean]
  saved: []
}>()

const { isConnected, user } = useAuth()

async function empty() {
  for(let pokeNumber of props.selectedPokemons) {
    await $fetch(`/api/statut/${pokeNumber}`, {
      method: 'POST',
      body: {
        idUser: user.value?.id,
        isOwned: false,
        isShiny: false,
      }
    })
  }

  emit('update:selectionMode', false)
  emit('saved')
}

async function normal() {
  for(let pokeNumber of props.selectedPokemons) {
    await $fetch(`/api/statut/${pokeNumber}`, {
      method: 'POST',
      body: {
        idUser: user.value?.id,
        isOwned: true,
      }
    })
  }

  emit('update:selectionMode', false)
  emit('saved')
}

async function shiny() {
  for(let pokeNumber of props.selectedPokemons) {
    await $fetch(`/api/statut/${pokeNumber}`, {
      method: 'POST',
      body: {
        idUser: user.value?.id,
        isShiny: true,
      }
    })
  }

  emit('update:selectionMode', false)
  emit('saved')
}

</script>