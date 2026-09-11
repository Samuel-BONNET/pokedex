<template>
  <div class="flex flex-col items-center gap-3">
    <div v-if="spriteList.length" class="flex items-center gap-2">
      <button @click="scrollPrev" class="rounded-full border border-slate-400 bg-white p-1 hover:bg-slate-200 disabled:opacity-40">
        <ChevronLeft />
      </button>

      <div ref="emblaRef" class="overflow-hidden w-36">
        <div class="flex">
          <div v-for="item in spriteList" :key="item.game" class="shrink-0 w-full flex justify-center">
            <img :src="item.sprite" loading="lazy" draggable="false" class="h-24 w-auto object-contain" />
          </div>
        </div>
      </div>

      <button @click="scrollNext" class="rounded-full border border-slate-400 bg-white p-1 hover:bg-slate-200 disabled:opacity-40">
        <ChevronRight />
      </button>
    </div>

    <p v-if="spriteList.length" class="text-xs">
      {{ currentItem?.name }} ({{ selectedIndex + 1 }} / {{ spriteList.length }})
    </p>

    <button v-if="spriteList.length && pokemon" @click="changeSpritePoke">Sauvegarder</button>
    <button v-if="spriteList.length && game" @click="changeSpriteGame">Sauvegarder</button>
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
}>()

const spriteList = computed(() =>
  props.availableJaquettes?.map(j => ({ ...j, game: j.name})) ?? props.pokemon?.availableGames?.map(g => ({ sprite: g.sprite, name: g.game, game: g.game })) ?? []
)

const emit = defineEmits<{ saved: [] }>()

const spriteTarget = ref<string | null>(null)
const gameTarget = ref<string | null>(null)

const { isConnected, user } = useAuth()

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,
  align: 'center',
})

const selectedIndex = ref(0)

function updateSelected() {
  selectedIndex.value = emblaApi.value?.selectedScrollSnap() ?? 0
}

watch(emblaApi, (api) => {
  if (!api) return
  updateSelected()
  api.on('select', updateSelected)
  api.on('reInit', updateSelected)
})

const currentItem = computed(() => spriteList.value[selectedIndex.value] ?? null)

watch(currentItem, (item) => {
  spriteTarget.value = item?.sprite ?? null
  gameTarget.value = item?.name ?? null
}, { immediate: true })

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

async function changeSpritePoke() {
  if (spriteTarget.value !== null && gameTarget.value !== null && props.pokemon) {
    const currentIdUser = isConnected.value && user.value ? user.value.id : 1

    await $fetch(`/api/preferences/pokemon/${props.pokemon.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser,
      }
    })
    emit('saved')
  }
}

async function changeSpriteGame() {
  if (spriteTarget.value !== null && gameTarget.value !== null && props.game) {
    const currentIdUser = isConnected.value && user.value ? user.value.id : 1

    await $fetch(`/api/preferences/game/${props.game.id}`, {
      method: 'POST',
      body: {
        currentSprite: spriteTarget.value,
        idUser: currentIdUser,
      }
    })
    emit('saved')
  }
}
</script>