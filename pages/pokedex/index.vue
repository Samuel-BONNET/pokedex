<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8  min-h-screen [overflow-anchor:none]">
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

                <div class="flex flex-col gap-4 justify-center items-center">
                  <div class="flex flex-row gap-2">
                    <div class="flex flex-col items-center text-md">
                      <details class="dropdown-checkbox relative w-full">
                        <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                          {{ text.pokedex.types }}
                        </summary>

                        <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20">
                          <div>
                            type selection
                            <button @click="typeMatchMode = typeMatchMode === 'any' ? 'all' : 'any'" class="justify-center p-2 m-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">{{ typeMatchMode }}</button>
                          </div>
                          <div class="grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto overscroll-contain w-64">
                            <label v-for="type in types" :key="type.name" class="cursor-pointer flex justify-center items-center">
                              <input name="couleur[]" v-model="selectedTypes" :value="type.name" type="checkbox" class="peer sr-only" />
                              <img :src="type.icon" class="h-10 object-contain border-transparent border-2 peer-checked:border-neutral-900 p-0.5" />
                            </label>
                          </div>
                        </div>
                      </details>
                    </div>

                    <div class="flex flex-col text-md items-center">
                    <details class="dropdown-checkbox relative">
                      <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                        {{ generationSearchQuery === 0 ? text.pokedex.generation : 'Gen ' + generationSearchQuery }}
                      </summary>
                      <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto overscroll-contain w-64">

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

                    <div class="flex flex-col text-md items-center">
                      <details class="dropdown-checkbox relative">
                        <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                          {{ text.pokedex.games }}
                        </summary>
                        <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto overscroll-contain w-64">
                          <div class="col-span-4 flex items-center justify-between border-b border-neutral-400 pb-1 mb-1">
                            <button class="cursor-pointer flex items-center gap-1 text-xs font-bold" @click="gameSearchQuery = []">
                              {{ text.pokedex.all }}
                            </button>
                            <button @click="gameMatchMode = gameMatchMode === 'any' ? 'all' : 'any'" class="px-2 py-1 text-xs font-bold bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">{{ gameMatchMode }}</button>
                          </div>
                          <label v-for="g in mainEntries" :key="g.id" class="cursor-pointer flex items-center justify-center gap-1">
                            <input type="checkbox" class="peer sr-only" :value="g.variantId" v-model="gameSearchQuery" />
                            <img :src="g.currentSprite" :alt="g.label" :title="g.label" class="h-10 object-contain" :class="gameSearchQuery.length > 0 && !gameSearchQuery.includes(g.variantId) && 'grayscale'" />
                          </label>
                        </div>
                      </details>
                    </div>

                    <div class="flex flex-col items-center text-md">
                      <details class="dropdown-checkbox relative w-full">
                        <summary class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">
                          {{ text.pokedex.moves }}{{ selectedMoves.length ? ' (' + selectedMoves.length + ')' : '' }}
                        </summary>
                        <div class="absolute left-0 mt-1 bg-neutral-200 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 p-2 w-64">
                          <div class="flex items-center justify-between border-b border-neutral-400 pb-1 mb-1">
                            <button class="cursor-pointer text-xs font-bold" @click="selectedMoves = []">
                              {{ text.pokedex.all }}
                            </button>
                            <button @click="moveMatchMode = moveMatchMode === 'any' ? 'all' : 'any'"
                                    class="px-2 py-1 text-xs font-bold bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">
                              {{ moveMatchMode }}
                            </button>
                          </div>
                          <input v-model="moveSearchQuery" :placeholder="text.pokedex.moveSearch"
                                 class="w-full bg-white border-2 border-neutral-700 px-2 py-1 text-xs outline-none focus:bg-amber-50 mb-1" />
                          <div ref="moveListEl" class="max-h-60 overflow-y-auto overscroll-contain">
                            <label v-for="move in visibleMoves" :key="move.id"
                                   class="relative cursor-pointer flex items-center gap-1 text-xs px-1 py-0.5 hover:bg-neutral-100"
                                   @mousedown.prevent>
                              <input v-model="selectedMoves" :value="move.id" type="checkbox" class="peer sr-only" @change="onMoveToggle" />
                              <span class="truncate peer-checked:bg-neutral-900 peer-checked:text-white" :title="move.nameEn">
                                {{ move.nameFr }}
                              </span>
                            </label>
                          </div>
                        </div>
                      </details>
                    </div>

                  </div>
                  <div class="flex flex-row gap-2">
                    <button @click="ownedSearchQuery = !ownedSearchQuery" class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">{{ ownedSearchQuery ? 'Voir tous' : 'Voir possédé'}}</button>

                    <button @click="shinySearchQuery = !shinySearchQuery" class="cursor-pointer bg-neutral-200 border-2 border-neutral-700 px-3 py-1 text-xs font-bold hover:bg-neutral-100 select-none">{{ shinySearchQuery ? 'Voir tous' : 'Voir shiny'}}</button>
                  </div>
                </div>
              </div>


              <div class="flex flex-row items-center gap-5 pt-2 border-t-2 border-dashed border-neutral-500">
                <div class="flex flex-col gap-3 ">
                  <div class="flex flex-wrap items-center justify-center gap-3 text-xs">
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
                </div>

                <div class="flex flex-col gap-2">
                  <Import />
                  <Export />
                </div>
              </div>

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
              <div class="flex flex-wrap items-center justify-center gap-1 pt-4">
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
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {VERSION_TO_GROUP} from "~/utils/gameVersions.ts";

const { text, gameName } = useLang()

const frenchSearchQuery = ref('')
const englishSearchQuery = ref('')
const pokeNumberSearchQuery = ref('')
const generationSearchQuery = ref(0)
const gameSearchQuery = ref<string[]>([])
const genBound = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025]
const getGeneration = (n: number) => genBound.findIndex(bound => n <= bound)
const toolbarEnable = ref(true)
const selectedTypes = ref<string[]>([])
const selectedMoves = ref<number[]>([])
const typeMatchMode = ref<'any' | 'all'>('any')
const gameMatchMode = ref<'any' | 'all'>('any')
const moveMatchMode = ref<'any' | 'all'>('any')
const ownedSearchQuery = ref(false)
const shinySearchQuery = ref(false)

const { data: types } = useFetch<{ name: string, icon: string }[]>('/api/types')
const filteredPokemons = computed(() => {
  const fr = frenchSearchQuery.value.trim().toLowerCase()
  const en = englishSearchQuery.value.trim().toLowerCase()
  const nb = pokeNumberSearchQuery.value.trim()
  const gen = generationSearchQuery.value
  const types = selectedTypes.value
  const owned = ownedSearchQuery.value
  const shiny = shinySearchQuery.value

  return (pokemons.value ?? []).filter(p => {
    if (fr && !p.nameFr.toLowerCase().includes(fr)) return false
    if (en && !p.nameEn.toLowerCase().includes(en)) return false
    if (nb && p.pokeNumber !== Number(nb)) return false
    if (gen && getGeneration(p.pokeNumber) !== gen) return false
    if (types.length > 0) {
      const pokeTypes = (p.types ?? []) as string[]
      if (typeMatchMode.value === 'all') {
        if (!types.every(t => pokeTypes.includes(t))) return false
      } else {
        if (!types.some(t => pokeTypes.includes(t))) return false
      }
    }

    const gameNames = selectedGameNames.value
    if (gameNames.length > 0) {
      const capturedGroups = new Set(
          (Array.isArray(p.capturedGame) ? p.capturedGame : [])
              .filter((v): v is string => typeof v === 'string')
              .map(v => VERSION_TO_GROUP[v] ?? v)
      )
      if (gameMatchMode.value === 'all') {
        if (!gameNames.every(name => capturedGroups.has(name))) return false
      } else {
        if (!gameNames.some(name => capturedGroups.has(name))) return false
      }
    }
    if (owned && !p.isOwned) return false
    return !(shiny && !p.isShiny);

  })
})

watch([frenchSearchQuery, englishSearchQuery, pokeNumberSearchQuery, generationSearchQuery, selectedTypes, gameSearchQuery, selectedMoves, moveMatchMode], () => { currentPage.value = 1 }, { deep: true })

const { user } = useAuth()
const { data: pokemons, refresh } = await useFetch('/api/pokemon', {
  query: computed(() => ({
    userId: user.value?.id ?? 1,
    moves: selectedMoves.value.join(','),
    moveMatchMode: moveMatchMode.value,
  })),
})

type ApiMove = { id: number; nameEn: string; nameFr: string; type: string }
const { data: moves } = await useFetch<ApiMove[]>('/api/moves')
const moveSearchQuery = ref('')
const visibleMoves = computed(() => {
  const q = moveSearchQuery.value.trim().toLowerCase()
  return (moves.value ?? []).filter(m => !q || m.nameEn.toLowerCase().includes(q) || m.nameFr.toLowerCase().includes(q))
})

type ApiGame = {
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}

type GameEntry = {
  id: number
  nameEn: string
  generation: string
  currentSprite: string
  variantId: string
  label: string
}

const { data: games } = await useFetch<ApiGame[]>('/api/games', {
  query: { userId: user.value?.id }
})

const mainEntries = computed<GameEntry[]>(() => (games.value ?? [])
    .filter((g): g is ApiGame & { currentSprite: string } => Boolean(g.currentSprite))
    .map(g => ({
      id: g.id,
      nameEn: g.nameEn,
      generation: g.generation,
      currentSprite: g.currentSprite,
      variantId: g.nameEn,
      label: gameName(g.nameEn),
    })))

const selectedGameNames = computed(() =>
  mainEntries.value
    .filter(g => gameSearchQuery.value.includes(g.variantId))
    .map(g => g.nameEn)
)
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

const moveListEl = ref<HTMLElement | null>(null)
let savedWindowY = 0
let savedListTop = 0
let restoringMoveScroll = false

function onMoveToggle() {
  savedWindowY = window.scrollY
  savedListTop = moveListEl.value?.scrollTop ?? 0
  restoringMoveScroll = true
}

function restoreMoveScroll() {
  window.scrollTo({ top: savedWindowY })
  moveListEl.value?.scrollTo({ top: savedListTop })
}

watch(selectedMoves, async () => {
  if (!restoringMoveScroll) return
  await nextTick()
  restoreMoveScroll()
}, { deep: true, flush: 'post' })

watch(pokemons, async () => {
  if (!restoringMoveScroll) return
  restoringMoveScroll = false
  await nextTick()
  restoreMoveScroll()
}, { flush: 'post' })

</script>
