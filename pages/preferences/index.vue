<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8 min-h-screen gap-4">
    <h1 class="text-4xl font-bold mb-6">
      {{ text.preferences.title }}
    </h1>

    <p class="text-lg">
      {{ text.preferences.intro }}
    </p>

    <div class="flex flex-col bg-blue-300">
      <ul v-for="(tierName, t) in tiers" :key="t" class="flex gap-2 p-2" :class="[t % 2 === 0 ? 'bg-black/90' : 'bg-black/80']" @dragover.prevent="onTierDragOver(t)" @drop="onTierDrop(t)">
        <div class="grid grid-cols-[8rem_1fr] gap-2 p-2">
          <span class="flex items-center justify-center bg-black/80 text-white text-xl font-bold w-32 min-h-28">
              {{ tierName }}
          </span>
          <div class="flex flex-wrap items-center gap-2 min-h-28" @dragover.prevent="onTierDragOver(t)" @drop="onTierDrop(t)">
            <li v-for="(g, i) in tierGames[t]" :key="g.id" class="shrink-0" draggable="true" @dragstart="onDragStart(t, i)" @dragover.prevent.stop="onDragOver(t, i)" @drop="onDrop(t, i)" @dragend="onDragEnd">
              <div v-if="overTier === t && overIndex === i && dragTier !== null" class="h-28 border-2 border-dashed border-white rounded-lg" :style="{ width: draggedWidth}" />
              <img v-else :src="g.currentSprite ?? img.games.defaultCover" ref="myImg" @load="updateWidth($event, i)" class="h-28 w-auto object-contain" :class="{ 'opacity-30': dragTier === t && dragIndex === i }" />
            </li>
          </div>
        </div>
      </ul>
    </div>

    <div class="flex flex-col justify-between items-center">
      <div class="flex flex-row gap-2">
        <button @click="reset" class="flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">{{ text.common.reset}}</button>
        <button @click="def" class="flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">{{ text.common.default}}</button>
        <button @click="save" class="flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer">{{ text.common.save }}</button>
      </div>
      <p v-if="message">{{ message }}</p>
    </div>

  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">

import { ref } from 'vue';

const { user } = useAuth()
const { img, text } = useLang()

type GameRow = {
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}

type GamePrefs = { gameOrder: number[], gameTierSizes?: number[] }
const { data: games } = await useFetch<GameRow[]>(`/api/games`, { query: { userId: user.value?.id} })
const { data: prefs } = await useFetch<GamePrefs>(`/api/preferences/game`, { query: { userId: user.value?.id } })
const tiers = text.preferences.tiers
const RANKED_TIERS = tiers.length - 1
const isDropZone = (t: number) => t === RANKED_TIERS
const imgWidths = ref<Record<number, string>>({})
const draggedWidth = ref('auto')

const updateWidth = (event: Event, index: number) => {
  const img = event.target as HTMLImageElement
  if (img) {
    imgWidths.value[index] = `${img.clientWidth}px`
  }
}

const sourceGames = (games.value ?? [])
  .filter(g => g.availableJaquettes.length > 0)
  .slice()
  .sort((a, b) => a.id - b.id)

const orderedGames = ref<GameRow[]>([...sourceGames])

const rank = new Map((prefs.value?.gameOrder ?? []).map((id, i) => [id, i]))

const UNRANKED = Number.MAX_SAFE_INTEGER

orderedGames.value.sort((a, b) =>
  (rank.get(a.id) ?? UNRANKED) - (rank.get(b.id) ?? UNRANKED) || a.id - b.id,
)

const defaultTierSizes = computed<number[]>(() => {
  const n = orderedGames.value.length
  const base = Math.floor(n / RANKED_TIERS)
  const rest = n % RANKED_TIERS
  return tiers.map((_, t) => (t < RANKED_TIERS ? base + (t < rest ? 1 : 0) : 0))
})

function resolveTierSizes(saved: unknown): number[] {
  const fallback = defaultTierSizes.value
  if (!Array.isArray(saved) || saved.length !== tiers.length) return fallback

  const cleaned = saved.map(n => (Number.isInteger(n) && n > 0 ? n : 0))
  const sum = cleaned.reduce((a, b) => a + b, 0)

  return sum === orderedGames.value.length ? cleaned : fallback
}

const hasSavedOrder = (prefs.value?.gameOrder?.length ?? 0) > 0
const emptyTierSizes = tiers.map((_, tier) => (tier === RANKED_TIERS ? sourceGames.length : 0))
const tierSizes = ref<number[]>(hasSavedOrder ? resolveTierSizes(prefs.value?.gameTierSizes) : emptyTierSizes)

function normalizedSizes(): number[] {
  const sizes = tiers.map((_, t) => Math.max(0, tierSizes.value[t] ?? 0))
  const overflow = Math.max(0, orderedGames.value.length - sizes.reduce((a, b) => a + b, 0))
  if (overflow) sizes[Math.min(RANKED_TIERS - 1, tiers.length - 1)]! += overflow
  return sizes
}

const tierGames = computed<GameRow[][]>(() => {

  // if game order length !== 0
  const sizes = normalizedSizes()
  const result: GameRow[][] = []
  let offset = 0

  for (let t = 0; t < tiers.length; t++) {
    const end = Math.min(offset + sizes[t]!, orderedGames.value.length)
    result.push(orderedGames.value.slice(offset, end))
    offset = end
  }
  return result
})

const rankedGames = computed(() => tierGames.value.slice(0, RANKED_TIERS).flat())

const dragTier = ref<number | null>(null)
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)
const overTier = ref<number | null>(null)

function onDragStart(tier: number, index: number) {

  const li = event?.currentTarget as HTMLElement
  const img = li?.querySelector('img')

  if (img) {
    draggedWidth.value = `${img.clientWidth}px`
  }

  dragTier.value = tier
  dragIndex.value = index
}

function onDragOver(tier: number, index: number) {
  overTier.value = tier
  overIndex.value = index
}

function onDragEnd() {
  dragTier.value = null
  dragIndex.value = null
  overTier.value = null
  overIndex.value = null
}

function tierStart(tier: number): number {
  const sizes = normalizedSizes()
  let offset = 0
  for (let t = 0; t < tier && t < sizes.length; t++) offset += sizes[t]!
  return Math.min(offset, orderedGames.value.length)
}

function toGlobal(tier: number, index: number): number {
  return Math.min(tierStart(tier) + index, orderedGames.value.length)
}

function toTierEnd(tier: number): number {
  const sizes = normalizedSizes()
  return Math.min(tierStart(tier) + (sizes[tier] ?? 0), orderedGames.value.length)
}

function onDrop(toTier: number, toIndex: number) {
  if (dragTier.value === null || dragIndex.value === null) return
  const from = dragTier.value
  const fromIdx = dragIndex.value
  if (from === toTier && fromIdx === toIndex) return

  const fromGlobal = toGlobal(from, fromIdx)
  const [moved] = orderedGames.value.splice(fromGlobal, 1)
  if (moved === undefined) return

  if (from !== toTier) {
    const sizes = tierSizes.value
    if ((sizes[from] ?? 0) <= 0) {
      orderedGames.value.splice(fromGlobal, 0, moved)
      onDragEnd()
      return
    }
    sizes[from] = sizes[from]! - 1
    sizes[toTier] = (sizes[toTier] ?? 0) + 1
  }

  const insertGlobal = toGlobal(toTier, toIndex)

  orderedGames.value.splice(insertGlobal, 0, moved)
  onDragEnd()
}

function onTierDragOver(tier: number) {
  overTier.value = tier
  overIndex.value = tierGames.value[tier]?.length ?? 0
}

function onTierDrop(tier: number) {
  if (dragTier.value === null || dragIndex.value === null) return
  const from = dragTier.value
  const fromIdx = dragIndex.value
  if (from === tier) return

  const fromGlobal = toGlobal(from, fromIdx)
  const [moved] = orderedGames.value.splice(fromGlobal, 1)
  if (moved === undefined) return

  if ((tierSizes.value[from] ?? 0) <= 0) {
    orderedGames.value.splice(fromGlobal, 0, moved)
    onDragEnd()
    return
  }

  tierSizes.value[from] = tierSizes.value[from]! - 1

  const insertGlobal = toTierEnd(tier)
  orderedGames.value.splice(insertGlobal, 0, moved)

  tierSizes.value[tier] = (tierSizes.value[tier] ?? 0) + 1
  onDragEnd()
}

const message = ref('')

async function persist() {
  if (!user.value) return

  await $fetch(`/api/preferences/game/order`, {
    method: 'POST',
    body: {
      order: rankedGames.value.map(g => g.id),
      tierSizes: tierSizes.value,
      idUser: user.value.id,
    },
  })
}

async function save() {
  await persist()
  message.value = text.preferences.orderSaved
}

async function reset() {
  orderedGames.value = [...sourceGames]
  tierSizes.value = tiers.map((_, tier) => (tier === RANKED_TIERS ? sourceGames?.length : 0))
}

async function def() {
  orderedGames.value = [...sourceGames]
  tierSizes.value = defaultTierSizes.value
}

</script>
