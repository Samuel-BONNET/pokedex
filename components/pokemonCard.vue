<template>
  <div class="w-36 flex flex-col items-center bg-white border rounded-md p-2"
    :class="[pokemon.isShiny ? 'border-yellow-300 hover:border-yellow-500' : (pokemon.isOwned ? 'border-blue-300 hover:border-blue-500' : 'border-slate-400 hover:border-slate-600'),
             selected ? 'border-[4px]' : 'border-[2px]']">
    <div class="relative flex justify-between w-full">
      <span class="text-[10px] text-slate-400 self-start">#{{ pokemon.pokeNumber }}</span>
      <span v-if="pokemon.isShiny" class="absolute top-0 right-0 text-[20px] -m-[3px] text-yellow-400">&#9733;</span>
    </div>
    <div v-if="!imageLoader" class="w-full aspect-square bg-slate-100 rounded">
      <img src="https://i.gifer.com/4OKl.gif">
    </div>
    <img  ref="spriteEl" :src="pokemon.isShiny && pokemon.currentSprite ? shinyUrl(pokemon.currentSprite) ?? undefined : pokemon.currentSprite ?? undefined" :class= "pokemon.isShiny || pokemon.isOwned ? 'w-full aspect-square object-contain' : 'w-full aspect-square object-contain grayscale'" loading="lazy" @load="onSpriteLoaded"/>
    <p class="mt-1 text-xs w-full text-center truncate">{{ pokemon.nameFr }}</p>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
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
}>()

const imageLoader = ref(false)
const spriteEl = ref<HTMLImageElement>()

function onSpriteLoaded() {
  imageLoader.value = true
}

function shinyUrl(url: string) {
  if(url.includes('red-blue') || url.includes('yellow')){
    return url
  }
  const partie = url.split('//')
  return partie[0] + '//' + partie[1] + '/shiny/' + partie[2]
}

onMounted(() => {
  if (spriteEl.value?.complete) imageLoader.value = true
})
</script>