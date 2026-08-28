<template>
  <section class="flex flex-col text-center mb-12 px-4 sm:px-8 bg-slate-50 min-h-screen">
    <h1 class="text-4xl font-bold mb-6">
      Préférences
    </h1>

    <p class="text-lg">
      Choisissez votre ordre de sprites de jeux préférés
    </p>

    <ul class="flex justify-center gap-2">
      <li v-for="(g, i) in orderedGames" :key="g.id"
          draggable="true" @dragstart="onDragStart(i)" @dragover.prevent="onDragOver(i)" @drop="onDrop(i)" @dragend="onDragEnd">
        <div v-if="overIndex === i && dragIndex !== null" class="h-20 w-14 border-2 border-dashed rounded" />
        <img v-else :src="g.currentSprite ?? '/img/games/defaultJaquette.png'" class="h-20 w-auto object-contain" :class="{ 'opacity-30': i === dragIndex }" />
      </li>
    </ul>

    <button @click="save" :disabled="!user">Sauvegarder</button>
    <button @click="update" :disabled="!user">Update Sprite</button>
    <p v-if="message">{{ message }}</p>

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

let dragIndex: number | null = null
const overIndex = ref<number | null>(null)

function onDragStart(i: number) {
  dragIndex = i
}

function onDragOver(i: number) {
  overIndex.value = i
}

function onDragEnd() {
  dragIndex = null
  overIndex.value = null
}

function onDrop(i: number) {
  const form = dragIndex
  dragIndex = null
  overIndex.value = null
  if (form === null || form === i) return
  const [moved] = orderedGames.value.splice(form, 1)
  if (moved === undefined) return
  orderedGames.value.splice(i, 0, moved)
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

async function update() {
  if (!user.value) return
  await $fetch(`/api/prefrences/pokemon/order`, {
    method: 'POST',
    body: { order: orderedGames.value.map(g => g.id ), idUser: user.value.id }
  })
}

</script>