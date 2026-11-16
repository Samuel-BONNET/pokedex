<template>
  <section class="max-w-5xl mx-auto px-4 py-8 font-mono">
    <header class="text-center mb-8 bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 max-w-2xl mx-auto">
      <div class="flex items-center justify-center gap-2 mb-1">
        <h1 class="text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-wide">
          {{ game ? gameName(game.nameEn) : '' }}
        </h1>
      </div>
      <p v-if="game" class="text-xs font-bold text-neutral-600 bg-neutral-200 inline-block px-3 py-0.5 border border-neutral-500 mt-2">
        {{ text.games.generation }} {{ game.generation }}
      </p>
    </header>
    <div class="flex flex-col md:flex-row items-center justify-center gap-8">
      <div class="flex flex-col items-center bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 shrink-0">
        <div class="bg-neutral-100 border-2 border-neutral-400 p-4 flex items-center justify-center min-w-70 min-h-87.5">
          <img v-if="game"
               :src="displaySprite"
               :alt="gameName(game.nameEn)"
               class="max-h-95 object-contain select-none [image-rendering:pixelated]"
               draggable="false" />
        </div>
      </div>
      <div v-if="game" class="bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 flex flex-col items-center justify-between w-full max-w-sm">
        <div class="flex flex-col items-center gap-4 mb-6 w-full">
          <div class="flex flex-col items-center gap-2 w-full">
            <button v-if="hasMultiple" @click="toggleVersion"
                    :disabled="!user"
                    class="w-full px-4 py-2 text-xs font-bold bg-white text-neutral-800 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
              {{ text.games.changeVersion }}{{ activeVersionLabel ? ' (' + activeVersionLabel + ')' : '' }}
            </button>
          </div>

          <label class="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold bg-white border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-neutral-800 cursor-pointer transition-all hover:bg-neutral-100 active:translate-y-0.5">
            <FileText class="w-4 h-4 shrink-0 text-neutral-700" />
            <span class="truncate">{{ file ? file.name : text.games.pickFile }}</span>
            <input type="file" accept=".sav" class="hidden" @change="verifierFichier" :disabled="!user" />
            <p v-if="message" class="text-red-500">{{ message }}</p>
          </label>

          <a v-if="url !== null"
             :href="url"
             :download="'Pokemon'+gameName(game.nameEn)+'.sav'"
             class="text-xs font-bold text-green-700 bg-emerald-100 border border-emerald-500 px-3 py-1 hover:bg-emerald-200 inline-flex items-center justify-center gap-1.5 transition-colors w-full">
            <Download class="w-4 h-4" /> {{ text.games.download }}
          </a>
        </div>

        <div class="flex flex-col items-center gap-3 w-full border-t-2 border-dashed border-neutral-500 pt-4">
          <div class="flex w-full gap-3">

            <button @click="upload"
                    :disabled="!user"
                    class="flex-1 px-3 py-2.5 text-xs font-bold bg-green-600 text-white border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
              {{ text.common.save }}
            </button>

            <button @click="remove"
                    :disabled="!user"
                    class="flex-1 px-3 py-2.5 text-xs font-bold bg-white text-red-600 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-red-50 hover:border-red-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
              {{ text.games.delete }}
            </button>
          </div>

          <button @click="resync"
                  :disabled="!user || syncing"
                  class="w-full px-3 py-2.5 text-xs font-bold bg-amber-100 text-amber-900 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-amber-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none inline-flex items-center justify-center gap-2">
            <RefreshCw class="w-4 h-4" :class="syncing ? 'animate-spin' : ''" />
            {{ syncing ? text.games.syncing : text.games.resync }}
          </button>

          <p v-if="result" class="text-xs font-bold text-neutral-800 bg-amber-100 border border-amber-400 p-2 text-center w-full mt-1">
            {{ result }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="fileData" class="flex flex-col items-center mt-3 text-xs font-bold bg-white border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-neutral-800 transition-all hover:bg-neutral-100">
      <span class="mt-3 text-xl">File Viewer</span>

      <div class="flex flex-col w-full px-3 py-2 items-center justify-center gap-4">
        <div class="flex flex-row flex-wrap items-center justify-center gap-5 w-full">
          <div v-for="b in badge">
            <img :src="`/img/badge/${b.name}.png`" class="max-w-10" :class="!b.earned && 'grayscale-100 opacity-50'" />
          </div>
        </div>

        <div>
          <h4 class="text-lg">
            Pokedex Regionnal : {{ gameSavePokedex[0]?.caught }} / {{ gameSavePokedex[0]?.total }}
          </h4>
          <h4 class="text-lg" v-if="gameSavePokedex[0]?.total !== gameSavePokedex[1]?.total">
            Pokedex Nationnal : {{ gameSavePokedex[1]?.caught }} / {{ gameSavePokedex[1]?.total }}
          </h4>
        </div>

        <div class="flex flex-row flex-wrap items-center justify-center gap-2 w-full">
          <div v-for="poke in team" :key="poke.id" class="flex flex-row bg-slate-500">
            <img :src="'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/' + (poke.isShiny ? 'shiny/' : 'regular/') + getName(poke.id) + '.png'" class="object-contain min-h-20 min-w-20" />
          </div>
        </div>

        <div class="flex flex-row flex-wrap items-center justify-center gap-2 w-full">
          <div v-for="poke in boxes" :key="poke.id" class="flex flex-row bg-slate-200">
            <img :src="'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/' + (poke.isShiny ? 'shiny/' : 'regular/') + getName(poke.id) + '.png'" class="object-contain min-h-20 min-w-20" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, FileText, RefreshCw } from 'lucide-vue-next'
import { versionFromVariant, versionLabel } from '~/utils/gameVersions'
import {type Badge, createEngine, type PokemonSummary} from '@pkhex-everywhere/engine'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getName } from '~/utils/pokeName.ts'

const { user } = useAuth()
const { img, text, gameName } = useLang()
const route = useRoute()
const router = useRouter()
const gameId = String(route.params.id)
const url = ref<string | null>(null)
const result = ref<string | null>(null)
const file = ref<File | null>(null)
const message = ref('')
const fileData = ref<ArrayBuffer | null>(null)
const team = ref<PokemonSummary[]>([])
const boxes = ref<PokemonSummary[]>([])
const badge = ref<any[]>([])
const syncing = ref(false)
let downloadToken = 0
let parseToken = 0
let parseQueue: Promise<void> = Promise.resolve()
const { data: game } = await useFetch<{
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}>(`/api/games/${gameId}`, {
  query: { userId: user.value?.id }
})

const ids = computed<number[]>(() => [...team.value, ...boxes.value].flatMap(p => (p.speciesId !== null ? [p.speciesId] : [])))

const gameSavePokedex = computed(() => {
  const generation = game.value?.generation
  if (!generation) return []
  return [getRegionnalPokedex([... new Set(ids.value)], generation), getNationnalPokedex([... new Set(ids.value)], generation)]
})

const versionQuery = computed(() => typeof route.query.version === 'string' ? route.query.version : null)

const versions = computed(() => {
  const jaq = game.value?.availableJaquettes ?? []
  if (!jaq.length) return [] as Array<{ id: string, sprite: string, label: string }>
  const map = new Map<string, any>()
  for (const j of jaq) {
    const m = j.name.match(/^(.*?)(1|2|21|22)$/)
    if (m) {
      const base = m[1]!
      if (!map.has(base)) map.set(base, { base, items: [] })
      map.get(base).items.push({ num: Number(m[2]), ...j })
    } else {
      map.set(j.name, { base: j.name, items: [{ num: 0, ...j }], single: true })
    }
  }
  const out: Array<{ id: string, sprite: string, label: string }> = []
  for (const v of map.values()) {
    if (v.single) {
      out.push({ id: v.items[0].name, sprite: v.items[0].sprite, label: versionLabel(v.items[0].name) })
    } else {
      v.items.sort((a: any, b: any) => a.num - b.num)
      for (const it of v.items) {
        out.push({ id: it.name, sprite: it.sprite, label: versionLabel(it.name) })
      }
    }
  }
  return out
})

const hasMultiple = computed(() => versions.value.length > 1)

const activeVersionId = ref<string | null>(null)
const activeVersionLabel = computed(() => versions.value.find(v => v.id === activeVersionId.value)?.label ?? null)

function resolveInitialVersion() {
  if (activeVersionId.value || !versions.value.length) return
  const fromQuery = versionQuery.value ? versions.value.find(v => v.id === versionQuery.value) : undefined
  if (fromQuery) {
    activeVersionId.value = fromQuery.id
    return
  }
  const current = game.value?.currentSprite ?? ''
  const match = versions.value.find(v => current.endsWith(v.sprite.split('/').pop()!) || current === v.sprite)
  activeVersionId.value = match?.id ?? versions.value[0]!.id
}

function clearUrl() {
  if (url.value) URL.revokeObjectURL(url.value)
  url.value = null
}

watch([game, versions], resolveInitialVersion, { immediate: true })

watch(activeVersionId, (id, previous) => {
  if (!id || id === previous) return
  parseToken++
  clearUrl()
  fileData.value = null
  team.value = []
  boxes.value = []
  badge.value = []
  void download()
})

watch(versionQuery, (vq) => {
  if (!vq || !versions.value.length) return
  const match = versions.value.find(v => v.id === vq)
  if (match && match.id !== activeVersionId.value) activeVersionId.value = match.id
})

onMounted(() => {
  void download()
})

onBeforeUnmount(() => {
  downloadToken++
  parseToken++
  clearUrl()
})

const displaySprite = computed(() => {
  const v = versions.value.find(x => x.id === activeVersionId.value)
  return v?.sprite ?? game.value?.currentSprite ?? img.games.defaultCover
})

function toggleVersion() {
  if (!hasMultiple.value || versions.value.length < 2) return
  const idx = versions.value.findIndex(v => v.id === activeVersionId.value)
  const next = (idx + 1) % versions.value.length
  activeVersionId.value = versions.value[next]!.id
  void router.replace({ query: { ...route.query, version: activeVersionId.value } })
}

async function upload() {
  if (!file.value) return
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    if (activeVersionId.value) formData.append('version', activeVersionId.value)
    const res = await fetch(`/api/games/${gameId}/save`, { method: 'POST', body: formData })
    if (!res.ok) throw new Error()

    file.value = null
    result.value = text.games.saveSent
    await download()
  } catch (e: any) {
    result.value = e?.data?.statusMessage ?? text.common.error
  }
}

async function download(): Promise<'ok' | 'missing' | 'error'> {
  const variant = activeVersionId.value
  if (!variant) return 'ok'
  const token = ++downloadToken

  try {
    const res = await fetch(`/api/games/${gameId}/save?version=${encodeURIComponent(variant)}`)
    if (token !== downloadToken) return 'ok'

    if (!res.ok) {
      clearUrl()
      fileData.value = null
      return res.status === 404 ? 'missing' : 'error'
    }

    const blob = await res.blob()
    if (token !== downloadToken) return 'ok'

    clearUrl()
    url.value = URL.createObjectURL(blob)
    const buffer = await blob.arrayBuffer()
    fileData.value = buffer
    await queueParse(buffer)
    return 'ok'
  } catch {
    if (token !== downloadToken) return 'ok'
    clearUrl()
    fileData.value = null
    return 'error'
  }
}

async function remove() {
  const variant = activeVersionId.value
  if (!variant) return

  downloadToken++
  parseToken++
  clearUrl()
  fileData.value = null
  team.value = []
  boxes.value = []
  badge.value = []

  const res = await fetch(`/api/games/${gameId}/save?version=${encodeURIComponent(variant)}`, { method: 'DELETE' })
  if (!res.ok) {
    result.value = text.common.error
    return
  }

  await $fetch('/api/statut/sync', {
    method: 'POST',
    body: { version: versionFromVariant(variant), pokemons: [], replace: true },
  })

  result.value = text.games.saveDeleted
}

const verifierFichier = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (selectedFile && selectedFile.size > 5242880) {
    message.value = "Fichier trop grand (Max 5Mo) !"
    file.value = null
    target.value = ""
  } else {
    message.value = ""
    file.value = selectedFile ?? null
  }
}

const engine = createEngine()

async function parseSave(buffer: ArrayBuffer, version: string, token: number) {
  await engine.game.load(new Uint8Array(buffer))
  const party = await engine.party.get() as PokemonSummary[]
  const box = await engine.box.get() as PokemonSummary[]
  const badges = await engine.trainer.badges() as Badge[]

  if (token !== parseToken) return
  team.value = party
  boxes.value = box
  badge.value = badges

  const shinyBySpecies = new Map<number, boolean>()
  for (const poke of [...party, ...box]) {
    if (poke.isEgg || poke.speciesId === null) continue
    shinyBySpecies.set(poke.speciesId, (shinyBySpecies.get(poke.speciesId) ?? false) || poke.isShiny)
  }

  if (token !== parseToken) return

  const sync = await $fetch<{ added: number; removed: number }>('/api/statut/sync', {
    method: 'POST',
    body: {
      version,
      pokemons: [...shinyBySpecies].map(([pokeNumber, isShiny]) => ({ pokeNumber, isShiny })),
      replace: true,
    },
  })

  if (token !== parseToken) return
  result.value = `${text.games.syncDone} (+${sync.added} / -${sync.removed})`
}

function queueParse(buffer: ArrayBuffer): Promise<void> {
  const variant = activeVersionId.value
  if (!variant) return parseQueue
  const token = ++parseToken
  const version = versionFromVariant(variant)

  parseQueue = parseQueue
      .then(() => parseSave(buffer, version, token))
      .catch((error) => {
        if (token !== parseToken) return
        console.error('Erreur PKHeX', error)
        message.value = 'Erreur lors de la lecture du fichier de sauvegarde.'
        result.value = null
      })

  return parseQueue
}

async function resync() {
  if (!user.value || syncing.value) return
  syncing.value = true
  message.value = ''
  result.value = text.games.syncing
  try {
    const status = await download()
    if (status === 'missing') result.value = text.games.noSave
    if (status === 'error') result.value = text.common.error
  } finally {
    syncing.value = false
  }
}
</script>

<style scoped>

</style>