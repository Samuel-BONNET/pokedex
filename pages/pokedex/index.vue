<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8 bg-slate-50 min-h-screen">
    <h1 class="text-4xl font-bold mb-6">
      Pokedex
    </h1>

    <div class="flex flex-wrap gap-2 justify-center mb-3">
      <input placeholder="Rechercher par nom français" v-model="frenchSearchQuery" class="border border-slate-300 rounded px-2 py-1 text-sm" />
      <input placeholder="Rechercher par nom anglais" v-model="englishSearchQuery" class="border border-slate-300 rounded px-2 py-1 text-sm" />
      <input placeholder="Numéro pokedex" v-model="pokeNumberSearchQuery" class="border border-slate-300 rounded px-2 py-1 text-sm" />
      <select v-model="generationSearchQuery" class="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
        <option :value="0" selected>Toutes</option>
        <option v-for="gen in genBound.length - 1" :key="gen" :value="gen">{{ gen }}</option>
      </select>
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-3">
      <label class="flex items-center gap-1 text-sm text-slate-600">
        page
        <select v-model="cardNumber" class="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
          <option :value="50">50</option>
          <option :value="200">200</option>
          <option :value="500">500</option>
          <option :value="1025">1025</option>
        </select>
      </label>

      <label class="flex items-center gap-1 text-sm text-slate-600">
        nb Poke par page
        <select v-model="cardsPerRow" class="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
          <option :value="5">5</option>
          <option :value="7">7</option>
          <option :value="9">9</option>
        </select>
      </label>
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-6">
      <button v-for="n in 4" :key="n" @click="currentPage = n"
        class="px-2 py-1 text-sm border border-slate-300 rounded hover:bg-slate-200"
        :class="currentPage === n ? 'bg-slate-800 text-white border-slate-800' : 'bg-white'">
        {{ n }}
      </button>
    </div>

    <div class="w-full mx-auto" :style="{ maxWidth: gridMaxWidth }">
      <div class="flex flex-wrap justify-center gap-4">
        <div v-for="p in displayPokemons" :key="p.pokeNumber" class="shrink-0">
          <NuxtLink class="block" :to="`/pokedex/${p.pokeNumber}`">
            <PokemonCard :pokemon="p" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">

const frenchSearchQuery = ref('')
const englishSearchQuery = ref('')
const pokeNumberSearchQuery = ref('')
const generationSearchQuery = ref(0)
const genBound = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025]
const getGeneration = (n: number) => genBound.findIndex(bound => n <= bound)

const filteredPokemons = computed(() => {
  const fr = frenchSearchQuery.value.trim().toLowerCase()
  const en = englishSearchQuery.value.trim().toLowerCase()
  const nb = pokeNumberSearchQuery.value.trim()
  const gen = generationSearchQuery.value

  return (pokemons.value ?? []).filter(p => {
    if (fr && !p.nameFr.toLowerCase().includes(fr)) return false
    if (en && !p.nameEn.toLowerCase().includes(en)) return false
    if (nb && p.pokeNumber !== Number(nb)) return false
    if (gen && getGeneration(p.pokeNumber) !== gen) return false
    return true
  })
})

watch([frenchSearchQuery, englishSearchQuery, pokeNumberSearchQuery, generationSearchQuery], () => { currentPage.value = 1 })

const { user } = useAuth()
const { data: pokemons } = await useFetch('/api/pokemon', {
  query: { userId: user.value?.id },
})

const cardsPerRow = ref(5)
const cardNumber = ref(50)
const currentPage = ref(1)

const CARD_WIDTH = 144
const GRID_GAP = 16
const gridMaxWidth = computed(() => {
  const n = cardsPerRow.value
  return `${n * CARD_WIDTH + (n - 1) * GRID_GAP}px`
})

const displayPokemons = computed(() => {
  const start = (currentPage.value - 1) * cardNumber.value
  const end = currentPage.value * cardNumber.value
  return filteredPokemons.value.slice(start, end)
})

</script>