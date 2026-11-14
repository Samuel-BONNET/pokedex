<template>
  <input type="file" accept=".csv" @change="importCSV" class="block text-transparent w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer border-2 border-neutral-900 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
  <p v-if="loading">Traitement en cours...</p>
  <p v-if="result">{{ result }}</p>
</template>

<script setup lang="ts">
const result = ref<string | null>(null)
const loading = ref(false)

async function importCSV(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  loading.value = true
  result.value = null

  try {
    const text = await file.text()

    const lines = text.trim().split('\n')
    const headers = lines[0]!.split(',').map(h => h.trim())
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row: Record<string, any> = {}
      headers.forEach((header, i) => {
        row[header] = values[i]
      })
      return row
    })

    const payload = rows.map(r => ({
      idPokemon: Number(r.idPokemon),
      idUser: Number(r.idUser),
      isOwned: r.isOwned === 'true',
      isShiny: r.isShiny === 'true',
    }))

    const res = await $fetch('/api/statut/import', {
      method: 'POST',
      body: { statuts: payload },
    })

    result.value = `${(res as any).count} statuts importés`
  } catch (e: any) {
    result.value = e?.data?.message ?? 'Erreur import'
  } finally {
    loading.value = false
    input.value = ''
  }
}
</script>
