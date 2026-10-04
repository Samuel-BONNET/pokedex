<template>
  <div class="w-24 shrink-0">
    <!-- Boîtier de la barre d'outils style console rétro -->
    <div ref="toolbarEl" class="w-fit flex flex-col gap-4 py-4 px-3 bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-y-auto">
      <div class="flex flex-col gap-3 justify-center items-center">

        <!-- Mode sélection simple -->
        <button :title="text.toolbar.unitSelection"
                @click="$emit('update:selectionMode', !selectionMode)"
                :class="selectionMode ? 'bg-neutral-800 text-green-400 border-neutral-900 shadow-none translate-y-0.5' : 'bg-white text-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100'"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all active:translate-y-0.5">
          <MousePointer2 class="w-5 h-5" />
        </button>

        <!-- Mode sélection par plage -->
        <button :title="text.toolbar.rangeSelection"
                @click="$emit('update:rangeSelectionMode', !rangeSelectionMode)"
                :class="rangeSelectionMode ? 'bg-neutral-800 text-green-400 border-neutral-900 shadow-none translate-y-0.5' : 'bg-white text-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100'"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all active:translate-y-0.5">
          <CopyPlus class="w-5 h-5" />
        </button>

        <!-- Annuler la sélection -->
        <button :title="text.toolbar.cancelSelection"
                :disabled="!selectionMode && !rangeSelectionMode"
                @click="$emit('update:selectionMode', false); $emit('update:rangeSelectionMode', false)"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all bg-white text-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-y-0">
          <Eraser class="w-5 h-5 text-red-600" />
        </button>

        <!-- Séparateur visuel -->
        <div class="w-full border-t-2 border-dashed border-neutral-400 my-1"></div>

        <!-- Marquer non possédé (Moins) -->
        <button :title="text.toolbar.markNotOwned"
                :disabled="selectedPokemons.length === 0"
                @click="empty"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all bg-white text-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:bg-neutral-900 active:text-white active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-y-0">
          <Minus class="w-5 h-5" />
        </button>

        <!-- Marquer possédé (Plus) -->
        <button :title="text.toolbar.markOwned"
                :disabled="selectedPokemons.length === 0"
                @click="normal"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all bg-white text-blue-600 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:bg-blue-600 active:text-white active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-y-0">
          <Plus class="w-5 h-5" />
        </button>

        <!-- Marquer Shiny -->
        <button :title="text.toolbar.markShiny"
                :disabled="selectedPokemons.length === 0"
                @click="shiny"
                class="w-12 h-12 border-2 flex items-center justify-center transition-all bg-white text-neutral-800 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-100 active:bg-amber-500 active:text-white active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-y-0">
          <img :src="img.sparkles" class="w-6 h-6 object-contain" />
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
const { img, text } = useLang()

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