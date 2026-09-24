<template>
  <section class="max-w-5xl mx-auto px-4 py-10">
    <header class="text-center mb-10">
      <h1 class="text-3xl font-bold text-slate-800">
        {{ game?.nameEn }}
      </h1>
      <p v-if="game" class="text-slate-500 mt-2">
        Génération {{ game.generation }}
      </p>
    </header>

    <div class="flex flex-col md:flex-row items-center justify-center gap-8">
      <div class="flex flex-col items-center gap-4">
        <img v-if="game" :src="game?.currentSprite ?? '/img/games/defaultJaquette.png'" :alt="game.nameEn"
             class="h-110 object-contain select-none" draggable="false" />
      </div>

      <div v-if="game" class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col items-center justify-between w-100">
        <div class="flex flex-col items-center gap-4 mb-6 mt-2 w-full">

          <div class="flex flex-col items-center gap-1">

          <div v-show="isOpen">
            <LazySpriteChoose v-if="game" :game="game" :available-jaquettes="game.availableJaquettes"
                              :current-sprite="game.currentSprite" @saved="onSpriteSaved" @close="isOpen = false" />
          </div>

          <button @click="isOpen = !isOpen" :disabled="!user"
                  class="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 hover:border-green-600 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed">
            {{ isOpen ? 'Fermer' : 'Changer la jaquette' }}
          </button>
          </div>

          <label class="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-600 cursor-pointer transition-colors hover:bg-slate-50">
            <FileText class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ file ? file.name : 'Choisir un fichier .sav' }}</span>
            <input type="file" accept=".sav" class="hidden" @change="onFileChange" :disabled="!user" />
          </label>

          <a v-if="url !== null" :href="url" download
             class="text-sm text-green-700 hover:underline inline-flex items-center justify-center gap-1">
            <Download class="w-4 h-4" /> Télécharger
          </a>
        </div>

        <div class="flex flex-col items-center gap-3 w-full">
          <div class="flex w-full gap-3">
            <button @click="upload" :disabled="!user"
                    class="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-green-600 text-white transition-colors hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed">
              Sauvegarder
            </button>
            <button @click="remove" :disabled="!user"
                    class="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 transition-colors hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed">
              Supprimer
            </button>
          </div>

          <p v-if="result" class="text-sm text-slate-600">
            {{ result }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download, FileText } from 'lucide-vue-next'

const { user } = useAuth()
const route = useRoute()
const gameId =  String(route.params.id)
const url = ref<string | null>(null)
const result = ref<string | null>(null)
const file = ref<File | null>(null)
const isOpen = ref(false)

const { data: game, refresh } = await useFetch<{
  id: number
  nameEn: string
  generation: string
  currentSprite: string | null
  availableJaquettes: { name: string, sprite: string }[]
}>(`/api/games/${gameId}`, {
  query: { userId: user.value?.id }
})

function onFileChange(e: Event) {
  file.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

async function upload() {
  if (!file.value) return
  try{
    const formData = new FormData()
    formData.append('file', file.value)
    const res = await fetch(`/api/games/${gameId}/save`, { method: 'POST', body: formData })
    if (!res.ok) throw new Error()

    file.value = null
    result.value = "Sauvegarde envoyée"
  } catch (e: any) {
    result.value = e?.data?.statusMessage ?? 'Erreur'
  }
}

async function download() {
  const res = await fetch(`/api/games/${gameId}/save`)
  if (res.ok){
    const blob = await res.blob()
    url.value = URL.createObjectURL(blob)
  }
}

async function remove() {
  await fetch(`/api/games/${gameId}/save`, { method: 'DELETE' })
  result.value = "Sauvegarde Supprimée"
}

download()

function onSpriteSaved() {
  refresh()
}

</script>

<style scoped>

</style>