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
        <div class="bg-neutral-100 border-2 border-neutral-400 p-2 flex items-center justify-center min-w-70 min-h-87.5">
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
             download
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

          <p v-if="result" class="text-xs font-bold text-neutral-800 bg-amber-100 border border-amber-400 p-2 text-center w-full mt-1">
            {{ result }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, FileText } from 'lucide-vue-next'
import { versionLabel } from '~/utils/gameVersions'

const { user } = useAuth()
const { img, text, gameName } = useLang()
const route = useRoute()
const router = useRouter()
const gameId = String(route.params.id)
const url = ref<string | null>(null)
const result = ref<string | null>(null)
const file = ref<File | null>(null)
const message = ref('')

const { data: game } = await useFetch<{
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}>(`/api/games/${gameId}`, {
  query: { userId: user.value?.id }
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

watch([game, versions], resolveInitialVersion, { immediate: true })

watch(versionQuery, (vq) => {
  if (!vq || !versions.value.length) return
  const match = versions.value.find(v => v.id === vq)
  if (match && match.id !== activeVersionId.value) {
    activeVersionId.value = match.id
    url.value = null
    void download()
  }
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
  url.value = null
  void download()
}

function onFileChange(e: Event) {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null
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

async function download() {
  if (!activeVersionId.value) return
  const res = await fetch(`/api/games/${gameId}/save?version=${encodeURIComponent(activeVersionId.value)}`)
  if (res.ok) {
    const blob = await res.blob()
    url.value = URL.createObjectURL(blob)
  } else {
    url.value = null
  }
}

async function remove() {
  if (!activeVersionId.value) return
  await fetch(`/api/games/${gameId}/save?version=${encodeURIComponent(activeVersionId.value)}`, { method: 'DELETE' })
  result.value = text.games.saveDeleted
  url.value = null
}

void download()

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

</script>
