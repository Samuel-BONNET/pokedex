<template>
  <section class="flex flex-col items-center bg-slate-50 min-h-screen px- py-8 font-pixel">
    <div class="flex justify-between gap-20 bg-red-600 p-6 rounded-lg">
      <div class="flex flex-col justify-between">

        <div class="flex flex-row  gap-2">
          <div class="w-15 h-15 bg-blue-500 flex flex-col justify-center text-center rounded-full">{{ pokemon!.id }}</div>
          <div class="flex flex-row gap-1">
            <NuxtLink to="/pokedex" class="w-6 h-6 bg-red-500 rounded-full"></NuxtLink>
            <div class="w-6 h-6 bg-orange-500 rounded-full"></div>
            <div class="w-6 h-6 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <div class="bg-slate-400 rounded-xl p-8 m-2 [clip-path:polygon(0_0,100%_0,100%_100%,9%_100%,0_88%)]">
          <div class="flex flex-col justify-center bg-white p-4 px-12 drop-shadow-lg  shadow-lg">
            <span class=" absolute flex justify-end text-yellow-400 top-0 right-0">
              <img src="/img/diverse/sparkles.png" class="object-contain relative w-10 p-1" :class="pokemon?.isShiny ? 'opacity-100' : 'opacity-0'" />
            </span>

            <img v-if="!isOpen" :src="pokemon?.isShiny && pokemon?.currentSprite ? shinyUrl(pokemon?.currentSprite) ?? undefined : pokemon?.currentSprite ?? undefined" :alt="pokemon?.nameFr" :class="!pokemon?.isShiny && !pokemon?.isOwned ? 'grayscale' : ''" class="w-48 h-48 object-contain mt-5" draggable="false" />

            <div v-show="isOpen" class="h-48 w-48 flex items-center justify-center">
              <LazySpriteChoose v-if="pokemon" :pokemon="pokemon" @saved="onSpriteSaved" />
            </div>

            <div class="flex flex-row justify-items-start items-center gap-4 w-full max-w-48 pt-1 bg-slate-100 mt-3">
              <span class="flex justify-end text-xs text-black">
                #{{ pokemon?.pokeNumber }}
              </span>
              <h1 class="text-center text-xs font-bold">
                {{ pokemon?.nameFr }}
              </h1>
            </div>
          </div>
          <button @click="isOpen = !isOpen" class="absolute mt-1 w-5 h-5 bg-red-600 rounded-full" />
        </div>


        <div class="flex flex-row justify-center items-center gap-2 my-6">
          <div class="flex flex-row justify-between gap-6">
            <button @click="changeOwned()" :disabled="!pokemon" class="w-15 h-7.5 flex items-center justify-center text-[6.5px] text-center border transition-colors bg-white text-black border-blue-500 hover:bg-blue-500 disabled:cursor-not-allowed">
              Pokeball
            </button>



            <button @click="changeShiny" :disabled="!pokemon" class="w-15 h-7.5 p-1 fit flex items-center justify-center text-[6.5px] text-center border transition-colors bg-white text-black border-yellow-500 hover:bg-yellow-500 disabled:cursor-not-allowed">
              Shiny
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center gap-6">


          <div class="grid grid-cols-3 grid-rows-3 bg-transparent place-items-center">
            <button @click="moduleSelected > 2 ? moduleSelected -= 2 : ''" class="col-start-2 row-start-1 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</button>

            <button @click="moduleSelected%2 === 0 ? moduleSelected -= 1 : ''" class="col-start-1 row-start-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">2</button>

            <button @click="moduleSelected%2 === 1 ? moduleSelected += 1 : ''" class="col-start-3 row-start-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">3</button>

            <button @click="moduleSelected < 3 ? moduleSelected += 2 : '' " class="col-start-2 row-start-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">4</button>
          </div>
        </div>

      </div>

      <div class="flex flex-col justify-between">
        <div v-if="pokemon" class="flex flex-row justify-between items-center gap-2">
          <div class="flex flex-col items-start gap-1">
            <div class="flex flex-row gap-3 items-center text-xs text-white"><RulerDimensionLine class="rotate-90" />{{ pokemon?.height / 10 }} m</div>
            <div class="flex flex-row gap-3 items-center text-xs text-white"><Weight />{{ pokemon?.weight / 10 }} kg</div>
          </div>

          <div class="flex flex-row justify-center items-center gap-4">
            <div>
              <img :src="`/img/types/${pokemon?.types[0]}.png`" class="max-h-[5vh]" />
            </div>
            <div v-if="pokemon?.types.length > 1">
              <img :src="`/img/types/${pokemon?.types[1]}.png`" class="max-h-[5vh]" />
            </div>
          </div>
        </div>

        <div class="flex flex-row justify-center items-center">
          <NuxtLink v-for="(stage, i) in pokemon?.evolutionChain ?? []"
              :key="stage.pokeNumber" :to="`/pokedex/${stage.pokeNumber}`"
              class="flex flex-col items-center border p-1 border-[3px] bg-white pt-2 pb-2 px-2"
              :class="stage.pokeNumber === pokemon?.pokeNumber ? 'border-blue-500 ' : 'border-white'">
            <img :src="stage.currentSprite ?? undefined" class="w-14 h-14 object-contain bg-white" />
          </NuxtLink>
        </div>

        <div v-if="pokemon" class="flex flex-col gap-2 bg-green-500 p-2">
          <div><span >></span><span>Hp: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "hp")].value }}</span></div>
          <div><span >></span><span>Attack: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "attack")].value }}</span></div>
          <div><span >></span><span>Def: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "defense")].value }}</span></div>
          <div><span >></span><span>Attack spe: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-attack")].value }}</span></div>
          <div><span >></span><span>Def spe: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-defense")].value }}</span></div>
          <div><span >></span><span>Speed: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "speed")].value }}</span></div>
        </div>

        <div v-if="pokemon" class="flex flex-row items-center justify-between gap-6 mb-6 text-white">
            <NuxtLink :disable="pokemon!.id > 1" :to="`/pokedex/${pokemon!.id-1}`">
              <div class="bg-slate-800 p-4 px-12 rounded-lg">
                Prev
              </div>
            </NuxtLink>

            <NuxtLink v-if="pokemon && pokemon?.id < MAX_ID_POKE" :to="`/pokedex/${pokemon?.id+1}`">
              <div class="bg-slate-800 p-4 px-12 rounded-lg">
                Next
              </div>
            </NuxtLink>
        </div>
        </div>
      </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { AvailableGames } from "~/components/spriteChoose.vue";
import { Circle, Weight, RulerDimensionLine  } from 'lucide-vue-next'
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


async function changeOwned() {
  if (!pokemon.value) return
  await $fetch(`/api/statut/${pokemon.value.pokeNumber}`, {
    method: 'POST',
    body: { idUser: user.value?.id, isOwned: !pokemon.value.isOwned },
  })
  refresh()
}

async function changeShiny() {
  if (!pokemon.value) return
  await $fetch(`/api/statut/${pokemon.value.pokeNumber}`, {
    method: 'POST',
    body: { idUser: user.value?.id, isShiny: !pokemon.value.isShiny },
  })
  refresh()
}



</script>