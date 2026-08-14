<template>
  <div class="w-36 flex flex-col items-center bg-white border border-slate-200 rounded-md p-2 hover:border-slate-400 transition-colors">
    <span class="text-[10px] text-slate-400 self-start">#{{ pokemon.pokeNumber }}</span>
    <div v-if="!imageLoader" class="w-full aspect-square bg-slate-100 rounded">
      <img src="https://i.gifer.com/4OKl.gif">
    </div>
    <img ref="spriteEl" :src="pokemon.currentSprite ?? undefined" class="w-full aspect-square object-contain" loading="lazy" @load="onSpriteLoaded"/>
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
  }
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