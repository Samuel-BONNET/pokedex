<template>
  <NuxtLink to="/pokedex">Retour au Pokedex</NuxtLink>
  <section class="flex flex-col items-center bg-slate-50 min-h-screen px-4 py-8">


    <div class="flex justify-between gap-20 bg-red-600 p-4 rounded-lg">
      <div title="left" class="flex flex-col justify-between">
        <div class="flex justify-center items-center gap-2">
          <span class="text-xl text-slate-100">#{{ pokemon?.pokeNumber }}</span>
          <h1 class="text-2xl font-bold">{{ pokemon?.nameFr }}</h1>
          <span v-if="pokemon?.isShiny" class="text-yellow-400"><Star /></span>
        </div>
        <div class="flex justify-center bg-white p-4 drop-shadow-lg mb-6">
          <img :src="pokemon?.isShiny && pokemon?.currentSprite ? shinyUrl(pokemon?.currentSprite) ?? undefined : pokemon?.currentSprite ?? undefined" :alt="pokemon?.nameFr" :class="!pokemon?.isShiny && !pokemon?.isOwned ? 'grayscale' : ''" class="w-48 h-48 object-contain" draggable="false" />
        </div>

        <div class="flex flex-row justify-center items-center gap-3 mb-6">
          <div>
            <button @click="markEmpty" :disabled="!pokemon || (!pokemon.isOwned && !pokemon.isShiny)" class="w-15 h-15 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-slate-300 text-slate-700 border-slate-400 hover:bg-slate-400">
              <Minus />
            </button>
          </div>

          <div>
            <button @click="isOpen = !isOpen" class="w-15 h-15 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-green-400 text-white border-green-500 hover:bg-green-500">
              Sprite
            </button>
          </div>

          <div class="flex flex-col items-center">
            <button @click="markOwned" :disabled="!pokemon || pokemon.isOwned" class="w-15 h-15 rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-blue-400 text-white border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed">
              <Plus />
            </button>
            <button @click="markShiny" :disabled="!pokemon || pokemon.isShiny" class="w-15 h-15 fit rounded-full flex items-center justify-center text-xs text-center leading-tight border transition-colors bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500 disabled:cursor-not-allowed">
              <Star class="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center gap-6">
          <div class="grid grid-cols-2 place-items-center h-28 bg-gray-100 gap-4 bg-red-600">
            <div class="w-10 h-10">
              <div v-if="module1" class="w-full h-full bg-blue-500" :class="moduleSelected === 1 ? 'bg-green-500/100' : ''"></div>
            </div>

            <div class="w-10 h-10">
              <div v-if="module2" class="w-full h-full bg-blue-500" :class="moduleSelected === 2 ? 'bg-green-500/100' : ''"></div>
            </div>

            <div class="w-10 h-10">
              <div v-if="module3" class="w-full h-full bg-blue-500" :class="moduleSelected === 3 ? 'bg-green-500/100' : ''"></div>
            </div>

            <div class="w-10 h-10">
              <div v-if="module4" class="w-full h-full bg-blue-500" :class="moduleSelected === 4 ? 'bg-green-500/100' : ''"></div>
            </div>
          </div>

          <div class="grid grid-cols-3 grid-rows-3 bg-transparent place-items-center">
            <button @click="moduleSelected > 2 ? moduleSelected -= 2 : ''" class="col-start-2 row-start-1 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</button>

            <button @click="moduleSelected%2 === 0 ? moduleSelected -= 1 : ''" class="col-start-1 row-start-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</button>

            <button @click="moduleSelected%2 === 1 ? moduleSelected += 1 : ''" class="col-start-3 row-start-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">3</button>

            <button @click="moduleSelected < 3 ? moduleSelected += 2 : '' " class="col-start-2 row-start-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">4</button>
          </div>
        </div>

        <div class="mt-4">
          <div class="px-4 bg-green-800 text-back/50 p-1">
            Module {{ moduleSelected }} activé !
          </div>
        </div>
      </div>

      <div title="right" class="flex flex-col justify-between">
        <div v-if="pokemon" class="flex flex-row justify-center items-center gap-2">
          <div class="flex flex-col items-center">
            <div>Taille : {{ pokemon?.height / 10 }} m</div>
            <div>Poids : {{ pokemon?.weight / 10 }} kg</div>
          </div>

          <div class="flex flex-col justify-center items-center gap-2">
            <div>{{ pokemon?.types[0] }}</div>
            <div v-if="pokemon?.types.length > 1">{{ pokemon?.types[1] }}</div>
          </div>
        </div>

        <div class="flex flex-row justify-center items-center gap-2">
          <NuxtLink v-for="(stage, i) in pokemon?.evolutionChain ?? []"
              :key="stage.pokeNumber"
              :to="`/pokedex/${stage.pokeNumber}`"
              class="flex flex-col items-center border rounded p-1 bg-white border-[3px]"
              :class="stage.pokeNumber === pokemon?.pokeNumber ? 'border-blue-500 ' : 'border-red-600'">
            <img
                :src="stage.currentSprite ?? undefined"
                class="w-14 h-14 object-contain" />
            <span class="text-xs">{{ stage.nameFr }}</span>
            <span v-if="stage.isShiny" class="text-yellow-400"><Star /></span>
          </NuxtLink>


        </div>

        <div class="flex flex-col justify-center items-center gap-2">
          <div class="flex flex-row gap-5">
            <button @click="module1 = !module1">1</button>
            <button @click="module2 = !module2">2</button>
          </div>

          <div class="flex flex-row gap-5">
            <button @click="module3 = !module3">3</button>
            <button @click="module4 = !module4">4</button>
          </div>
        </div>

        <div v-if="pokemon" class="flex flex-col gap-2">
          <div><span>Hp: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "hp")].value }}</span></div>
          <div><span>Attack: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "attack")].value }}</span></div>
          <div><span>Def: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "defense")].value }}</span></div>
          <div><span>Attack spe: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-attack")].value }}</span></div>
          <div><span>Def spe: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-defense")].value }}</span></div>
          <div><span>Speed: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "speed")].value }}</span></div>
        </div>

        <div v-if="pokemon" class="flex flex-row bg-slate-500 justify-between px-2">
          <div>
            <NuxtLink v-if="pokemon!.id > 1" :to="`/pokedex/${pokemon!.id-1}`">
              <Circle />
            </NuxtLink>
            <div v-else>
              <Circle />
            </div>
          </div>

          <div class="bg-slate-400 px-4">{{ pokemon!.id }}</div>

          <div>
            <NuxtLink v-if="pokemon && pokemon?.id < MAX_ID_POKE" :to="`/pokedex/${pokemon?.id+1}`">
              <Circle />
            </NuxtLink>
            <div v-else>
              <Circle />
            </div>
          </div>
        </div>

      </div>
      </div>
    <div v-show="isOpen">
      <LazySpriteChoose v-if="pokemon" :pokemon="pokemon" @saved="onSpriteSaved" />
    </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { AvailableGames } from "~/components/spriteChoose.vue";
import { Minus, Plus, Star, Circle } from 'lucide-vue-next'
import {shinyUrl} from "#server/utils/sprite";
import type { EvolutionStage } from "~/server/utils/evolution";

const route = useRoute()
const id = route.params.id
const isOpen = ref(false)
const MAX_ID_POKE = 1025
const module1 = ref(true)
const module2 = ref(true)
const module3 = ref(true)
const module4 = ref(true)
const moduleSelected = ref(1)

const { user } = useAuth()
const { data: pokemon, refresh } = await useFetch<{
  id: number
  nameFr: string
  pokeNumber: number
  currentSprite: string
  isOwned: boolean
  isShiny: boolean
  height: number
  weight: number
  types: any[]
  stats: any[]
  availableGames: AvailableGames[],
  evolutionChain: EvolutionStage[]
}>(`/api/pokemon/${id}`, {
  query: { userId: user.value?.id },
})

function onSpriteSaved() {
  refresh()
}

async function markEmpty() {
  if (!pokemon.value) return
  await $fetch(`/api/statut/${pokemon.value.pokeNumber}`, {
    method: 'POST',
    body: { idUser: user.value?.id, isOwned: false, isShiny: false },
  })
  refresh()
}

async function markOwned() {
  if (!pokemon.value) return
  await $fetch(`/api/statut/${pokemon.value.pokeNumber}`, {
    method: 'POST',
    body: { idUser: user.value?.id, isOwned: true },
  })
  refresh()
}

async function markShiny() {
  if (!pokemon.value) return
  await $fetch(`/api/statut/${pokemon.value.pokeNumber}`, {
    method: 'POST',
    body: { idUser: user.value?.id, isShiny: true },
  })
  refresh()
}



</script>