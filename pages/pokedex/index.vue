<template>
  <section class="flex flex-col text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Pokedex
    </h1>

    <input placeholder="Rechercher par nom français" v-model="frenchSearchQuery" />
    <input placeholder="Rechercher par nom anglais" v-model="englishSearchQuery" />
    <input placeholder="Rechercher un numéro de pokedex" v-model="pokeNumberSearchQuery" />
    <select  v-model="generationSearchQuery">
      <option :value="all" selected>Toutes</option>
      <option v-for="index in genBound.length" :value="index">{{ index }}</option>
    </select>
        <option :value="0" selected>Toutes</option>
        <option v-for="gen in genBound.length - 1" :key="gen" :value="gen">{{ gen }}</option>

      <div>
        <span class="m-2">page</span>
        <select v-model="cardNumber" class="m-2">
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="75">75</option>
          <option :value="100">100</option>
        </select>

        <span class="m-2">nb Poke per page</span>
        <select v-model="cardsPerRow" class="m-2">
          <option :value="3">3</option>
          <option :value="4">4</option>
          <option :value="5">5</option>
        </select>

      </div>
      <div>
        <button class="m-2" @click="currentPage=1">1</button>
        <button class="m-2" @click="currentPage=2">2</button>
        <button class="m-2" @click="currentPage=3">3</button>
        <button class="m-2" @click="currentPage=4">4</button>
      </div>
    <div class="grid w-fit mx-auto gap-5" :class="gridClass">
      <div v-for="p in displayPokemons" :key="p.pokeNumber">
        <NuxtLink  :to="`/pokedex/${p.pokeNumber}`">
          <PokemonCard :pokemon="p" />
        </NuxtLink>
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

const cardsPerRow = ref(3)
const cardNumber = ref(50)
const currentPage = ref(1)

const gridClass = computed(() => {
  switch (cardsPerRow.value) {
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-4'
    case 5:
      return 'grid-cols-5'
    default:
      return 'grid-cols-4'
  }
})

const displayPokemons = computed(() => {
  const start = (currentPage.value - 1) * cardNumber.value
  const end = currentPage.value * cardNumber.value
  return filteredPokemons.value.slice(start, end)
})

</script>