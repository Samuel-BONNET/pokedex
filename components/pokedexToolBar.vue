<template>
  <div class="sticky top-0 max-h-screen w-40 flex flex-col gap-10 py-20 bg-slate-200/50 overflow-y-auto">
    <div class="flex flex-col gap-4 justify-center mb-3 items-center">

      <label>Selectors</label>

      <button title="Activer la sélection unitaire" @click="$emit('update:selectionMode', !selectionMode)" :class="selectionMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-800 border-slate-300'"
              class="w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight border px-3 py-1 text text-sm border rounded-full hover:bg-slate-200 hover:text-black transition-colors">
        1
      </button>

      <button title="Activer la sélection d'ensemble" @click="$emit('update:rangeSelectionMode', !rangeSelectionMode)" :class="rangeSelectionMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-800 border-slate-300'"
              class="w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight borderpx-3 py-1 text text-sm border rounded-full hover:bg-slate-200 hover:text-black transition-colors">
        A-B
      </button>

      <button title="Annuler la sélection" :disabled="!selectionMode && !rangeSelectionMode" @click="$emit('update:selectionMode', false); $emit('update:rangeSelectionMode', false)" class="disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-red-300 text-red-700 border-red-400 px-3 py-1 text text-sm border rounded hover:bg-red-500 transition-colors"><X  /></button>


      <span v-if="(selectionMode || rangeSelectionMode) && selectedPokemons.length > 0" class="text-sm text-slate-600">
        {{ selectedPokemons.length }} sélectionné(s)
      </span>
    </div>

    <div class="flex flex-col gap-4 justify-center mb-3 items-center">
      <label>Statut</label>
      <button title="Marquer comme non possédé" :disabled="selectedPokemons.length === 0" @click="empty" class="disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-slate-300 text-slate-700 border-slate-400 hover:bg-slate-400"><Minus /></button>
      <button title="Marquer comme possédé" :disabled="selectedPokemons.length === 0" @click="normal" class="disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-blue-400 text-white border-blue-500 hover:bg-blue-500"><Plus /></button>
      <button title="Marquer comme shiny" :disabled="selectedPokemons.length === 0" @click="shiny" class="disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500"><Star class="w-5 h-5 fill-current" /></button>
    </div>
  </div>
</template>


<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

const props = defineProps<{
  selectedPokemons: number[]
  selectionMode: boolean
  rangeSelectionMode: boolean
}>()

const emit = defineEmits<{
  'update:selectionMode': [value: boolean]
  'update:rangeSelectionMode': [value: boolean]
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
  if(props.selectionMode){
    emit('update:selectionMode', false)
  }
  else{
    emit('update:rangeSelectionMode', false)
  }
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
  if(props.selectionMode){
    emit('update:selectionMode', false)
  }
  else{
    emit('update:rangeSelectionMode', false)
  }
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
  if(props.selectionMode){
    emit('update:selectionMode', false)
  }
  else{
    emit('update:rangeSelectionMode', false)
  }
  emit('saved')
}

import { Plus, Minus, Star, X } from 'lucide-vue-next'

</script>