<template>
  <div class="w-20 shrink-0">
    <div ref="toolbarEl" class="w-20 flex flex-col gap-10 py-8 px-5 bg-transparent rounded-xl overflow-y-auto">
      <div class="flex flex-col gap-4 justify-center mb-3 items-center">
        <button title="Activer la sélection unitaire" @click="$emit('update:selectionMode', !selectionMode)" :class="selectionMode ? 'bg-slate-800 text-green-500 border-slate-800 hover:border-green-500' : 'bg-white text-slate-800 border-slate-300 hover:text-green-500 hover:border-green-500'"
                class="w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight px-3 py-1 text border hover:bg-transparent hover:text-black transition-colors">
          <MousePointer2 class="hover:grayscale-0 hover:fill-green-500 hover:text-green-600" />
        </button>

        <button title="Activer la sélection d'ensemble" @click="$emit('update:rangeSelectionMode', !rangeSelectionMode)" :class="rangeSelectionMode ? 'bg-slate-800 text-green-500  border-slate-800 hover:border-green-500' : 'bg-white text-slate-800 border-slate-300 hover:text-green-500 hover:border-green-500'"
                class="w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight borderpx-3 py-1 border hover:bg-transparent hover:text-black transition-colors">
          <CopyPlus class="hover:grayscale-0 hover:text-green-600" />
        </button>

        <button title="Annuler la sélection" :disabled="!selectionMode && !rangeSelectionMode" @click="$emit('update:selectionMode', false); $emit('update:rangeSelectionMode', false)"
                class="disabled:opacity-50 disabled:cursor-not-allowed w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-white text-slate-800 border-slate-400 hover:not-disabled:border-red-500 px-3 py-1 text grayscale hover:not-disabled:grayscale-0">
          <Eraser class="min-w-5.5 min-h-5.5 text-red-600" />
        </button>

        <button title="Marquer comme non possédé" :disabled="selectedPokemons.length === 0" @click="empty" class="disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-white active:not-disabled:bg-black  text-slate-800 active:text-white border-slate-400 hover:not-disabled:border-black ">
          <Minus />
        </button>

        <button title="Marquer comme possédé" :disabled="selectedPokemons.length === 0" @click="normal" class="disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-white active:not-disabled:bg-blue-500  text-blue-500 active:text-white border-slate-400 hover:not-disabled:border-blue-500">
          <Plus />
        </button>

        <button title="Marquer comme shiny" :disabled="selectedPokemons.length === 0" @click="shiny" class="disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale w-12.5 h-12.5 rounded-lg flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-white active:not-disabled:bg-orange-500 text-slate-800 border-slate-400 hover:not-disabled:border-orange-500 hover:border-slate-400 brightness-100 ">
          <img src="/img/diverse/sparkles.png" class="p-2 ml-1" />
        </button>
      </div>
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

const { user } = useAuth()

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

import { Plus, Minus, Eraser, MousePointer2, CopyPlus } from 'lucide-vue-next'

const toolbarEl = ref<HTMLElement>()

onMounted(() => {
  const el = toolbarEl.value
  if (!el) return
  const parent = el.parentElement

  const onScroll = () => {
    const parentRect = parent!.getBoundingClientRect()
    const elHeight = el.offsetHeight
    const vh = window.innerHeight

    if (parentRect.height <= vh) {
      el.style.position = ''
      el.style.top = ''
      el.style.left = ''
      el.style.alignSelf = 'center'
      return
    }
    const idealTop = (vh - elHeight) / 2
    const minTop = parentRect.top
    const maxTop = parentRect.bottom - elHeight
    const top = Math.max(minTop, Math.min(idealTop, maxTop))

    el.style.position = 'fixed'
    el.style.top = `${top}px`
    el.style.left = `${parentRect.left}px`
    el.style.zIndex = '50'
    el.style.alignSelf = ''
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

</script>