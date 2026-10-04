<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8  min-h-screen">
    <div v-for="position in (cardNumber > 50 ? 2 : 1)" :key="position">
      <div class="flex flex-row gap-4 justify-center mb-6" v-if="position === 1">
        <div class="flex flex-col justify-center items-center">
          <div class="flex justify-center items-center my-4 w-fit">
            <div class="bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-center items-center gap-4 w-full text-neutral-900 font-mono">
              <div class="flex flex-col gap-2 justify-center">
                <h1 class="text-4xl font-bold mb-6">
                  {{ text.pokedex.title }}
                </h1>
                <div class="flex flex-row gap-2">
                  <input :placeholder="text.pokedex.search.fr" v-model="frenchSearchQuery" class="bg-white border-2 border-neutral-700 px-2 py-1 text-xs outline-none focus:bg-amber-50" />
                  <input :placeholder="text.pokedex.search.en" v-model="englishSearchQuery" class="bg-white border-2 border-neutral-700 px-2 py-1 text-xs outline-none focus:bg-amber-50" />
                  <input :placeholder="text.pokedex.search.number" v-model="pokeNumberSearchQuery" class="bg-white border-2 border-neutral-700 px-2 py-1 text-xs outline-none focus:bg-amber-50" />
                </div>

                <div class="flex flex-row gap-8 justify-center items-center">
                  <div class="flex flex-col items-center text-md">
                    <details class="dropdown-checkbox relative w-full">
                      <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                        {{ text.pokedex.types }}
                      </summary>
                      <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto w-64">
                        <label v-for="type in types" :key="type.name" class="cursor-pointer flex justify-center items-center">
                          <input name="couleur[]" v-model="selectedTypes" :value="type.name" type="checkbox" class="peer sr-only" />
                          <img :src="type.icon" class="h-10 object-contain border-transparent border-2 peer-checked:border-neutral-900 p-0.5" />
                        </label>
                      </div>
                    </details>
                  </div>

                  <div class="flex flex-col text-md items-center">
                    <details class="dropdown-checkbox relative">
                      <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                        {{ generationSearchQuery === 0 ? text.pokedex.generation : 'Gen ' + generationSearchQuery }}
                      </summary>
                      <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto w-64">

                        <label class="col-span-4 cursor-pointer flex items-center gap-1 border-b border-neutral-400 pb-1 mb-1">
                          <input type="radio" :value="0" v-model="generationSearchQuery" />
                          {{ text.pokedex.all }}
                        </label>

                        <label v-for="gen in genBound.length - 1" :key="gen" class="cursor-pointer flex items-center gap-1">
                          <input type="radio" :value="gen" v-model="generationSearchQuery" />
                          Gen {{ gen }}
                        </label>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-center gap-3 pt-2 border-t-2 border-dashed border-neutral-500 text-xs">
                <label class="flex flex-col items-center gap-1">
                  <span class="font-bold">{{ text.pokedex.page }}</span>
                  <select v-model="cardNumber" class="bg-white border-2 border-neutral-700 px-1 py-0.5 text-xs">
                    <option :value="50">50</option>
                    <option :value="200">200</option>
                    <option :value="500">500</option>
                    <option :value="1025">1025</option>
                  </select>
                </label>

                <label class="flex flex-col items-center gap-1">
                  <span class="font-bold">{{ text.pokedex.perPage }}</span>
                  <select v-model="cardsPerRow" class="bg-white border-2 border-neutral-700 px-1 py-0.5 text-xs">
                    <option :value="5">5x5</option>
                    <option :value="7">7x7</option>
                    <option :value="9">9x9</option>
                  </select>
                </label>
              </div>

              <button class="bg-neutral-800 text-white border-2 border-neutral-900 px-3 py-1 text-xs active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" @click="toolbarEnable = !toolbarEnable">
                {{ toolbarEnable ? text.pokedex.hideToolbar : text.pokedex.showToolbar }}
              </button>

              <div class="flex flex-wrap items-center justify-center gap-1 pt-2 border-t-2 border-dashed border-neutral-500">
                <button v-if="totalPages > 2" @click="currentPage = 1" class="px-2 py-1 text-xs bg-white border-2 border-neutral-700 active:translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  &lt;&lt;
                </button>
                <button v-if="totalPages > 1" @click="currentPage > 1 && currentPage--" class="px-2 py-1 text-xs bg-white border-2 border-neutral-700 active:translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  &lt;
                </button>

                <button v-for="n in visiblePages" :key="n" @click="currentPage = n"
                        class="px-2.5 py-1 text-xs border-2 border-neutral-700 active:translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-bold"
                        :class="currentPage === n ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'">
                  {{ n }}
                </button>

                <button v-if="totalPages > 1" @click="currentPage < totalPages && currentPage++" class="px-2 py-1 text-xs bg-white border-2 border-neutral-700 active:translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  &gt;
                </button>
                <button v-if="totalPages > 2" @click="currentPage = totalPages" class="px-2 py-1 text-xs bg-white border-2 border-neutral-700 active:translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  &gt;&gt;
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-row">
            <div class="flex justify-between">
              <PokedexToolBar v-if="toolbarEnable" :selection-mode="selectionMode" :selected-pokemons="selectedPokemons" :rangeSelectionMode="rangeSelectionMode" @update:selection-mode="selectionMode = $event" @update:rangeSelectionMode="rangeSelectionMode = $event" @saved="refresh" />
            </div>

            <div class="w-full mx-auto bg-neutral-200 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 font-mono" :style="{ maxWidth: gridMaxWidth }">
              <div class="flex flex-wrap justify-center gap-3">
                <div v-for="p in displayPokemons" :key="p.pokeNumber" class="shrink-0">
                  <div v-if="selectionMode || rangeSelectionMode"
                       class="cursor-pointer transition-transform active:translate-y-0.5"
                       @click="toggleSelection(p.pokeNumber)"
                       @contextmenu.prevent
                       @click.right.prevent="deselectPokemon(p.pokeNumber)">
                    <PokemonCard :pokemon="p" :selected="selectedPokemons.includes(p.pokeNumber)" :range-start-end="p.pokeNumber === rangeStart || p.pokeNumber === rangeEnd" />
                  </div>

                  <NuxtLink v-else class="block transition-transform active:translate-y-0.5" :to="`/pokedex/${p.pokeNumber}`">
                    <PokemonCard :pokemon="p" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">
const { text } = useLang()

const frenchSearchQuery = ref('')
const englishSearchQuery = ref('')
const pokeNumberSearchQuery = ref('')
const generationSearchQuery = ref(0)
const genBound = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025]
const getGeneration = (n: number) => genBound.findIndex(bound => n <= bound)
const toolbarEnable = ref(true)
const selectedTypes = ref<string[]>([])

const { data: types } = useFetch<{ name: string, icon: string }[]>('/api/types')
const { themeClassesSecondaryBackground } = useLang()
const filteredPokemons = computed(() => {
  const fr = frenchSearchQuery.value.trim().toLowerCase()
  const en = englishSearchQuery.value.trim().toLowerCase()
  const nb = pokeNumberSearchQuery.value.trim()
  const gen = generationSearchQuery.value
  const types = selectedTypes.value

  return (pokemons.value ?? []).filter(p => {
    if (fr && !p.nameFr.toLowerCase().includes(fr)) return false
    if (en && !p.nameEn.toLowerCase().includes(en)) return false
    if (nb && p.pokeNumber !== Number(nb)) return false
    if (gen && getGeneration(p.pokeNumber) !== gen) return false
    if (types.length > 0) {
      const pokeTypes = (p.types ?? []) as string[]
      if (!types.some(t => pokeTypes.includes(t))) return false
    }
    return true
  })
})

watch([frenchSearchQuery, englishSearchQuery, pokeNumberSearchQuery, generationSearchQuery, selectedTypes], () => { currentPage.value = 1 })

const { user } = useAuth()
const { data: pokemons, refresh } = await useFetch('/api/pokemon', {
  query: { userId: user.value?.id ?? 1 },
})

const { cardsPerRow, cardNumber, currentPage } = usePokedexPrefs()

const CARD_WIDTH = 144
const GRID_GAP = 12
const CONTAINER_PADDING = 32
const CONTAINER_BORDER = 8
const gridMaxWidth = computed(() => {
  const n = cardsPerRow.value
  return `${n * CARD_WIDTH + (n-1) * GRID_GAP + CONTAINER_PADDING + CONTAINER_BORDER}px`
})

const displayPokemons = computed(() => {
  const start = (currentPage.value - 1) * cardNumber.value
  const end = currentPage.value * cardNumber.value
  return filteredPokemons.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPokemons.value.length / cardNumber.value))
)

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

const selectionMode = ref(false)
const selectedPokemons = ref<number[]>([])

watch(selectionMode, (val) => {
  if (val) rangeSelectionMode.value = false
  if (!val) selectedPokemons.value = []
})

const rangeSelectionMode = ref<boolean>(false)
const rangeStart = ref<number | null>(null)
const rangeEnd = ref<number | null>(null)

function toggleSelection(n: number) {
  if (selectionMode.value) {
    const idx = selectedPokemons.value.indexOf(n)
    if (idx >= 0) selectedPokemons.value.splice(idx, 1)
    else selectedPokemons.value.push(n)
  }
  else if (rangeSelectionMode.value) {
    if (rangeStart.value === null) {
      rangeStart.value = n
    }
    else if (rangeEnd.value === null) {
      rangeEnd.value = n
      applyRangeSelectionMode()
    }
    else {
      throw Error('Selection Error')
    }
  }
}

watch(rangeSelectionMode, (val) => {
  if (val) selectionMode.value = false
  if (!val) {
    rangeStart.value = null
    rangeEnd.value = null
    selectedPokemons.value = []
  }
})

function applyRangeSelectionMode() {
  if (rangeStart.value !== null && rangeEnd.value !== null) {
    const min = Math.min(rangeStart.value!, rangeEnd.value!)
    const max = Math.max(rangeStart.value!, rangeEnd.value!)
    const newPokes = filteredPokemons.value.filter(p => p.pokeNumber >= min && p.pokeNumber <= max).map(p => p.pokeNumber).filter(n => !selectedPokemons.value.includes(n))
    selectedPokemons.value.push(...newPokes)
    rangeStart.value = null
    rangeEnd.value = null
  }
  else{
    throw Error('Start or End is missing')
  }
}

function deselectPokemon(n: number) {
  const id = selectedPokemons.value.indexOf(n)
  if (id >= 0) selectedPokemons.value.splice(id, 1)
}

const visiblePages = computed<number[]>(() => {
  const maxVisiblePages = 5
  const total = totalPages.value
  const current = currentPage.value

  const start = Math.max(1, Math.min(current - Math.floor(maxVisiblePages / 2), total - maxVisiblePages + 1))
  const end = Math.min(total, start + maxVisiblePages - 1)
  return Array.from( {length: Math.max(0, end - start + 1) }, (_, index) => start + index)
})

</script>