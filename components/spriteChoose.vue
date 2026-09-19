<template>
  <div class="flex flex-col items-center gap-2">
    <div v-if="spriteList.length" class="flex items-center gap-2">
      <button @click="scrollPrev" class="rounded-full border border-slate-300 bg-white p-1 hover:bg-slate-200 disabled:opacity-40">
        <ChevronLeft />
      </button>

      <div ref="emblaRef" class="overflow-hidden w-36">
        <div class="flex">
          <div v-for="item in spriteList" :key="item.game" class="shrink-0 w-full flex justify-center">
            <img :src="item.sprite" loading="lazy" draggable="false" class="h-24 w-auto object-contain" />
          </div>
        </div>
      </div>

      <button @click="scrollNext" class="rounded-full border border-slate-300 bg-white p-1 hover:bg-slate-200 disabled:opacity-40">
        <ChevronRight />
      </button>
    </div>

    <p v-if="spriteList.length" class="text-xs text-slate-500">
      {{ currentItem?.name }} ({{ selectedIndex + 1 }} / {{ spriteList.length }})
    </p>

    <div class="flex gap-3">
      <button v-if="spriteList.length && pokemon" @click="save" :disabled="!isConnected"
              class="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white transition-colors hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed">
        Sauvegarder
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";
import useEmblaCarousel from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

export type AvailableGames = {
  game: string
  generationName: string
  generationId: number
  sprite: string
}

const props = defineProps<{
  pokemon?: { id: number, availableGames: AvailableGames[] },
  game?: { id: number }
  availableJaquettes?: { name: string, sprite: string }[]
  currentSprite?: string | null
}>()

const spriteList = computed(() =>
  props.availableJaquettes?.map(j => ({ ...j, game: j.name})) ?? props.pokemon?.availableGames?.map(g => ({ sprite: g.sprite, name: g.game, game: g.game })) ?? []
)

const emit = defineEmits<{ saved: []; close: [] }>()

const spriteTarget = ref<string | null>(null)
const gameTarget = ref<string | null>(null)

const { isConnected, user } = useAuth()

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,
  align: 'center',
})

const selectedIndex = ref(0)

let userSelect = false
let saveTimer: ReturnType<typeof setTimeout> | null = null
const lastSavedSprite = ref<string | null>(props.currentSprite ?? null)

onUnmounted(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

function updateSelected() {
  selectedIndex.value = emblaApi.value?.selectedScrollSnap() ?? 0
}

function selectChanged() {
  userSelect = true
  updateSelected()
}

watch(emblaApi, (api) => {
  if (!api) return
  updateSelected()
  api.on('select', selectChanged)
  api.on('reInit', updateSelected)
})

const currentItem = computed(() => spriteList.value[selectedIndex.value] ?? null)

watch(currentItem, (item) => {
  spriteTarget.value = item?.sprite ?? null
  gameTarget.value = item?.name ?? null

  if (props.game && userSelect && spriteTarget.value !== null) {
    userSelect = false
    if (spriteTarget.value === lastSavedSprite.value) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      void autoSaveGame()
    }, 300)
  }
}, { immediate: true })

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

const currentIdUser = computed(() => isConnected.value && user.value ? user.value.id : 1)

async function save() {
  if (spriteTarget.value === null || gameTarget.value === null) return

  if (props.game) {
    await $fetch(`/api/preferences/game/${props.game.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser.value,
      }
    })
  } else if (props.pokemon) {
    await $fetch(`/api/preferences/pokemon/${props.pokemon.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser.value,
      }
    })
  }
  emit('saved')
}

async function autoSaveGame() {
  if (spriteTarget.value === null || spriteTarget.value === lastSavedSprite.value) return

  lastSavedSprite.value = spriteTarget.value
  await $fetch(`/api/preferences/game/${props.game!.id}`, {
    method: 'POST',
    body: {
      currentSprite: spriteTarget.value,
      idUser: currentIdUser.value,
    }
  })
  emit('saved')
}
</script>