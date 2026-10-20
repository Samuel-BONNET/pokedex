<template>
  <!-- Carte Pokémon style sprite/cartouche rétro -->
  <div class="w-36 flex flex-col items-center bg-white p-2 border-4 transition-all select-none font-mono"
       :class="[
         rangeStartEnd
           ? 'border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] -translate-y-0.5'
           : selected
             ? 'border-blue-600 shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] -translate-y-0.5'
             : pokemon.isShiny
               ? 'border-amber-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
               : pokemon.isOwned
                 ? 'border-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                 : 'border-neutral-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] opacity-75 hover:opacity-100 hover:border-neutral-700']">
    <div class="relative flex justify-between w-full items-center mb-1">
      <span class="text-[10px] font-bold text-neutral-600 bg-neutral-200 px-1 border border-neutral-400">
        #{{ String(pokemon.pokeNumber).padStart(3, '0') }}
      </span>
      <span v-if="pokemon.isShiny" class="absolute top-0 right-0">
        <img :src="img.sparkles" class="w-5 h-5 object-contain" />
      </span>
    </div>

    <div class="w-full aspect-square bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center overflow-hidden p-1">
      <div v-if="!imageLoader" class="w-full h-full flex items-center justify-center bg-neutral-200">
        <img :src="img.loading" class="w-6 h-6 animate-pulse" />
      </div>
      <img ref="spriteEl"
           :src="pokemon.isShiny && pokemon.currentSprite ? shinyUrl(pokemon.currentSprite) ?? undefined : pokemon.currentSprite ?? undefined"
           :class="imageLoader ? (pokemon.isShiny || pokemon.isOwned ? 'w-full h-full object-contain' : 'w-full h-full object-contain grayscale') : 'w-0 h-0 overflow-hidden opacity-0'"
           loading="lazy"
           @load="onSpriteLoaded"/>
    </div>

    <p class="mt-1.5 text-xs font-bold w-full text-center truncate text-neutral-900 tracking-tight"
       :class="imageLoader ? '' : 'opacity-0'">
      {{ pokemon.nameFr }}
    </p>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {shinyUrl} from "#server/utils/sprite";

const { img } = useLang()

const props = defineProps<{
  pokemon: {
    id: number
    nameFr: string
    pokeNumber: number
    currentSprite: string | null
    isShiny: boolean
    isOwned: boolean
  }
  selected?: boolean
  rangeStartEnd?: boolean
}>()

const imageLoader = ref(false)
const spriteEl = ref<HTMLImageElement>()

function onSpriteLoaded() {
  imageLoader.value = true
}

onMounted(() => {
  if (spriteEl.value?.complete) imageLoader.value = true
})
</script>
