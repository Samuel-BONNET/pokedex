<template>
  <div class="w-36 flex flex-col items-center bg-white border rounded-md p-2"
       :class="[rangeStartEnd ? 'border-red-500' : pokemon.isShiny ? 'border-yellow-300 hover:border-yellow-500' : pokemon.isOwned ? 'border-blue-400 hover:border-blue-500' : 'border-slate-400 hover:border-slate-600',
    rangeStartEnd ? 'border-[3px]' : selected ? 'border-[3px]' : 'border-[2px]']">
    <div class="relative flex justify-between w-full">
      <span class="text-[10px] text-slate-400 self-start">#{{ pokemon.pokeNumber }}</span>
      <span v-if="pokemon.isShiny" class="absolute top-0 right-0 text-[20px] -m-[3px] text-yellow-400">&#9733;</span>
    </div>
    <div v-if="!imageLoader" class="w-full aspect-square bg-slate-100 rounded">
      <img src="https://i.gifer.com/4OKl.gif">
    </div>
    <img ref="spriteEl" :src="pokemon.isShiny && pokemon.currentSprite ? shinyUrl(pokemon.currentSprite) ?? undefined : pokemon.currentSprite ?? undefined" :class= "imageLoader ? (pokemon.isShiny || pokemon.isOwned ? 'w-full aspect-square object-contain' : 'w-full aspect-square object-contain grayscale') : 'w-0 h-0 overflow-hidden opacity-0'" loading="lazy" @load="onSpriteLoaded"/>
    <p class="mt-1 text-xs w-full text-center truncate" :class="imageLoader ? '' : 'opacity-0'" >{{ pokemon.nameFr }}</p>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {shinyUrl} from "#server/utils/sprite";

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
