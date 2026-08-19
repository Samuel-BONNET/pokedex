<template>
  <section class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Games
    </h1>

    <p class="text-lg">
      Gérez vos sauvegardes ici
    </p>
  </section>

  <section class="flex flex-col items-center gap-4 mb-12 text-center">
    <img :src="game?.currentJaquette" />

    <input type="file" accept=".sav" @change="onFileChange" :disabled="!user" />
    <a v-if="url" :href="url" download>Télécharger</a>
    <div class="flex gap-5">
      <button @click="upload" :disabled="!user">Sauvegarder</button>
      <button @click="remove" :disabled="!user">Supprimer</button>
    </div>

    <p>{{ result }}</p>
  </section>
</template>

<script setup lang="ts">
const { user } = useAuth()
const route = useRoute()
const gameId =  String(route.params.id)
const url = ref<string | null>(null)
const result = ref<string | null>(null)
const file = ref<File | null>(null)

const { data: game } = await useFetch<{
  id: number
  nameEn: string
  generation: string
  currentJaquette: string
}>(`/api/games/${gameId}`)

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

</script>

<style scoped>

</style>