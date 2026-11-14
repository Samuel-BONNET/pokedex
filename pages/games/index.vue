<template>
  <section class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      {{ text.games.title }}
    </h1>

    <p class="text-lg">
      {{ text.games.intro }}<br>
      {{ text.games.choose }}
    </p>
  </section>

  <div v-if="filteredEntries.length" class="relative">
    <button @click="scrollPrev" class="z-10 absolute top-1/2 -translate-y-1/2 left-2 flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer"><ChevronLeft class="hover:text-black" /></button>

    <div ref="emblaRef" class="overflow-hidden">
      <div class="flex gap-[2vw]">
        <div v-for="(e, i) in loopedEntries" :key="i" class="shrink-0 flex items-center" :class="blurClass(i)">
          <NuxtLink class="block" :to="`/games/${e.id}?version=${encodeURIComponent(e.variantId)}`">
            <GameCard :game="e" :variant-label="e.label" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <button @click="scrollNext" class="z-10 absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer"><ChevronRight class="hover:text-black" /></button>

    <p v-if="selectedEntry" class="text-center text-2xl mt-8">
      {{ selectedEntry.label }}
    </p>
  </div>
</template>

<script setup lang="ts">
import useEmblaCarousel from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { versionLabel } from '~/utils/gameVersions'

const { user } = useAuth()
const { text, gameName } = useLang()
const { seeAllGames } = useToggle()

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
  .filter(g => g.currentSprite)
  .map(g => ({
    id: g.id,
    nameEn: g.nameEn,
    generation: g.generation,
    currentSprite: g.currentSprite!,
    variantId: g.nameEn,
    label: gameName(g.nameEn),
  })))

const allEntries = computed<GameEntry[]>(() => {
  const out: GameEntry[] = []
  for (const g of games.value ?? []) {
    if (!g.currentSprite) continue

    const jaq = g.availableJaquettes ?? []
    if (!jaq.length) {
      out.push({ id: g.id, nameEn: g.nameEn, generation: g.generation, currentSprite: g.currentSprite, variantId: g.nameEn, label: gameName(g.nameEn) })
      continue
    }

    const groups = new Map<string, { items: { name: string, sprite: string, num: number }[] }>()
    for (const j of jaq) {
      const m = j.name.match(/^(.*?)(1|2|21|22)$/)
      if (m) {
        const base = m[1]!
        if (!groups.has(base)) groups.set(base, { items: [] })
        groups.get(base)!.items.push({ name: j.name, sprite: j.sprite, num: Number(m[2]) })
      } else {
        groups.set(j.name, { items: [{ name: j.name, sprite: j.sprite, num: 0 }] })
      }
    }

    for (const grp of groups.values()) {
      if (grp.items.length === 1) {
        const it = grp.items[0]!
        const vl = versionLabel(it.name)
        out.push({
          id: g.id,
          nameEn: g.nameEn,
          generation: g.generation,
          currentSprite: it.sprite,
          variantId: it.name,
          label: vl !== it.name ? vl : gameName(g.nameEn),
        })
      } else {
        grp.items.sort((a, b) => a.num - b.num)
        for (const it of grp.items) {
          out.push({
            id: g.id,
            nameEn: g.nameEn,
            generation: g.generation,
            currentSprite: it.sprite,
            variantId: it.name,
            label: versionLabel(it.name),
          })
        }
      }
    }
  }
  return out
})

const filteredEntries = computed(() => seeAllGames.value ? mainEntries.value.filter(e => e.currentSprite) : allEntries.value.filter(e => e.currentSprite))

const loopedEntries = computed(() => [
  ...filteredEntries.value,
  ...filteredEntries.value,
  ...filteredEntries.value,
])

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  duration: 0,
  align: 'center',
  containScroll: false,
  startIndex: filteredEntries.value.length || 0,
})

const selectedIndex = ref(filteredEntries.value.length || 0)
const seeAll = ref(false)

function updateSelected() {
  selectedIndex.value = emblaApi.value?.selectedScrollSnap() ?? 0
}

watch(emblaApi, (api) => {
  if (!api) return
  updateSelected()
  api.on('select', updateSelected)
  api.on('reInit', updateSelected)
})

const selectedEntry = computed(() => {
  const len = filteredEntries.value.length
  if (!len) return null
  return filteredEntries.value[selectedIndex.value % len] ?? null
})

function blurClass(index: number) {
  const len = filteredEntries.value.length
  if (!len) return ''
  const sel = selectedIndex.value % len
  const pos = index % len
  const d = Math.min((pos - sel + len) % len, (sel - pos + len) % len)
  if (d === 1) return 'blur-light scale-95'
  if (d === 2) return 'blur-strong scale-90'
  if (d > 2) return 'blur-extrem scale-90'
  return ''
}

function move(direction: 1 | -1) {
  const api = emblaApi.value
  if (!api) return
  const N = filteredEntries.value.length
  if (!N) return
  const S = api.selectedScrollSnap()

  if (direction === 1 && S >= 2 * N) {
    api.scrollTo(((S + 1) % N) + N, true)
  } else if (direction === -1 && S < N) {
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
