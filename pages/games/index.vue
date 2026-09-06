<template>

  <section class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Games
    </h1>

    <p class="text-lg">
      Gérez vos sauvegardes ici<br>
      Choississez un jeu
    </p>
  </section>


  <div v-if="filteredGames.length" class="relative">
    <button @click="scrollPrev" class="z-10 absolute top-1/2 -translate-y-1/2 left-2 rounded-lg bg-blue-300 hover:bg-blue-500 px-5 py-4 shadow"><ChevronLeft class="text-white" /></button>

    <div ref="emblaRef" class="overflow-hidden">
      <div class="flex gap-[2vw]">
        <div v-for="(g, i) in loopedGames" :key="i" class="shrink-0 flex items-center" :class="blurClass(i)">
          <NuxtLink class="block" :to="`/games/${g.id}`">
            <GameCard :game="g" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <button @click="scrollNext" class="z-10 absolute top-1/2 -translate-y-1/2 right-2 rounded-lg bg-blue-300 hover:bg-blue-500 px-5 py-4 shadow"><ChevronRight class="text-white" /></button>

    <p v-if="selectedGame" class="text-center text-2xl mt-8">
      {{ selectedGame.nameEn }}
    </p>
  </div>
</template>

<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { user } = useAuth()
const { data: games } = await useFetch('/api/games', {
  query: { userId: user.value?.id }
})

const filteredGames = computed(() => (games.value ?? []).filter(g => g.currentSprite))

const loopedGames = computed(() => [
  ...filteredGames.value,
  ...filteredGames.value,
  ...filteredGames.value,
])

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  duration: 0,
  align: 'center',
  containScroll: false,
  startIndex: filteredGames.value.length || 0,
})

const selectedIndex = ref(filteredGames.value.length || 0)

function updateSelected() {
  selectedIndex.value = emblaApi.value?.selectedScrollSnap() ?? 0
}

watch(emblaApi, (api) => {
  if (!api) return
  updateSelected()
  api.on('select', updateSelected)
  api.on('reInit', updateSelected)
})

const selectedGame = computed(() => {
  const len = filteredGames.value.length
  if (!len) return null
  return filteredGames.value[selectedIndex.value % len] ?? null
})

function blurClass(index: number) {
  const len = filteredGames.value.length
  if (!len) return ''
  const sel = selectedIndex.value % len
  const pos = index % len
  const d = Math.min((pos - sel + len) % len, (sel - pos + len) % len)
  if (d === 1) return 'blur-light opacity-90 scale-95'
  if (d === 2) return 'blur-strong opacity-70 scale-90'
  if (d > 2) return 'blur-extrem opacity-60 scale-90'
  return ''
}

function move(direction: 1 | -1) {
  const api = emblaApi.value
  if (!api) return
  const N = filteredGames.value.length
  if (!N) return
  const S = api.selectedScrollSnap()

  if (direction === 1 && S >= 2 * N) {
    // fin de la 3e copie → retour invisible dans la copie centrale
    api.scrollTo(((S + 1) % N) + N, true)
  } else if (direction === -1 && S < N) {
    // début de la 1re copie → retour invisible dans la copie centrale
    api.scrollTo((((S - 1) % N) + N) % N + N, true)
  } else if (direction === 1) {
    api.scrollNext()
  } else {
    api.scrollPrev()
  }
}

function scrollPrev() {
  move(-1)
}

function scrollNext() {
  move(1)
}

</script>

<style scoped>
.blur-light {
  filter: blur(5px);
}
.blur-strong {
  filter: blur(8px);
}

.blur-extrem {
  filter: blur(12px);
}
</style>