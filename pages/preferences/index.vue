<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8 bg-slate-50 min-h-screen gap-4">
    <h1 class="text-4xl font-bold mb-6">
      Préférences
    </h1>

    <p class="text-lg">
      Choisissez votre ordre de sprites de jeux préférés
    </p>

    <div class="flex flex-col ">
      <ul v-for="(tierName, t) in TIER_NAMES" :key="tierName" class="flex gap-2 p-2" :class="TIER_NAMES.indexOf(tierName) % 2 === 0 ? 'bg-black/80' : 'bg-black/70'" @dragover.prevent="onTierDragOver(t)" @drop="onTierDrop(t)">
        <div class="flex flex-row gap-2">
          <span class="flex flex-row justify-center bg-black/80 items-center text-white text-xl font-bold w-32 min-h-28">
              {{ tierName }}
          </span>
          <li v-for="(g, i) in tierGames[t]" :key="g.id" draggable="true" @dragstart="onDragStart(t, i)" @dragover.prevent.stop="onDragOver(t, i)" @drop="onDrop(t, i)" @dragend="onDragEnd">
            <div v-if="overTier === t && overIndex === i && dragTier !== null" class="h-28 w-14 border-2 border-dashed rounded" />
            <img v-else :src="g.currentSprite ?? '/img/games/defaultJaquette.png'" class="h-28 w-auto object-contain" :class="{ 'opacity-30': dragTier === t && dragIndex === i }" />
          </li>
        </div>
      </ul>
    </div>

    <div class="flex flex-col justify-between items-center">
      <button @click="save" :disabled="!user" class="px-2 py-1 text-sm border border-slate-300 rounded transition-colors hover:bg-slate-200 hover:border-green-600 hover:text-green-800 action:bg-green-300 action:text-white">Sauvegarder</button>
      <p v-if="message">{{ message }}</p>
    </div>

  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">

const { user } = useAuth()

type GameRow = {
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}

const { data: games } = await useFetch<GameRow[]>(`/api/games`, { query: { userId: user.value?.id} })
const { data: prefs } = await useFetch<{ gameOrder: number[] }>(`/api/preferences/game`, { query: { userId: user.value?.id } })

const orderedGames = ref((games.value ?? []).filter(g => g.availableJaquettes.length > 0))

const rank = new Map((prefs.value?.gameOrder ?? []).map((id, i) => [id, i]))

orderedGames.value.sort((a, b) => ((rank.get(a.id) ?? games.value!.length) - (rank.get(b.id) ?? games.value!.length)) || a.id - b.id)

const TIER_NAMES = ['Favori', "J'aime beaucoup", "J'apprécie", 'Neutre', 'Peu utilisé']

const defaultSizes = computed(() => {
  const n = orderedGames.value.length
  const base = Math.floor(n / TIER_NAMES.length)
  const rest = n % TIER_NAMES.length
  return TIER_NAMES.map((_, i) => base + (i < rest ? 1 : 0))
})

const tierSizes = ref<number[]>(defaultSizes.value)

const tierGames = computed(() => {
  const result: GameRow[][] = []
  let offset = 0
  for (let t = 0; t < TIER_NAMES.length; t++) {
    const size = tierSizes.value[t] ?? 0
    const end = Math.min(offset + size, orderedGames.value.length)
    result.push(orderedGames.value.slice(offset, end))
    offset = end
  }
  while (offset < orderedGames.value.length) {
    const game = orderedGames.value[offset]
    if (game && result.length) {
      result[result.length - 1]!.push(game)
    }
    offset++
  }
  return result
})

const dragTier = ref<number | null>(null)
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)
const overTier = ref<number | null>(null)

function onDragStart(tier: number, index: number) {
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

function toGlobal(tier: number, index: number): number {
  let offset = 0
  for (let t = 0; t < tier; t++) {
    offset += tierSizes.value[t] ?? 0
  }
  return offset + index
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
    tierSizes.value[from] = (tierSizes.value[from] ?? 0) - 1
    tierSizes.value[toTier] = (tierSizes.value[toTier] ?? 0) + 1
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

  tierSizes.value[from] = (tierSizes.value[from] ?? 0) - 1

  const targetLen = tierSizes.value[tier] ?? 0
  const insertGlobal = toGlobal(tier, targetLen)
  orderedGames.value.splice(insertGlobal, 0, moved)

  tierSizes.value[tier] = targetLen + 1
  onDragEnd()
}

const message = ref('')

async function save() {
  if (!user.value) return
  await $fetch(`/api/preferences/game/order`, {
    method: 'POST',
    body: { order: orderedGames.value.map(g => g.id ), idUser: user.value.id }
  })
  message.value = 'Ordre enregistré'
}

</script>