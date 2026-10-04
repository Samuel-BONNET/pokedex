<template>
  <section class="flex flex-col items-center min-h-screen py-8 font-pixel">
    <div class="flex flex-row justify-end items-stretch">
      <div class="flex justify-between bg-red-600 py-6 pt-0 px-4 rounded-l-lg">
        <div class="flex flex-col justify-between ">
          <div class="relative flex flex-row -mx-4">
            <div class="abulte flex flex-row gap- z-10 [clip-path:polygon(0%_0%,100%_0%,100%_20%,65%_100%,0%_100%,0%_20%)] bg-red-800 w-58 h-20 p-2 rounded-lg">
              <div class="w-15 h-15 bg-blue-500 flex flex-col justify-center text-center rounded-full border border-gray-700">{{ pokemon!.id }}</div>
                <div class="flex flex-row gap-5  h-fit py-2">
                  <NuxtLink to="/pokedex" class="w-4 h-4 bg-red-500 rounded-full border border-red-950/70"></NuxtLink>
                  <div class="w-4 h-4 bg-orange-500 rounded-full border border-orange-950/70"></div>
                  <div class="w-4 h-4 bg-green-500 rounded-full border border-green-950/50"></div>
                </div>
              </div>
              <div class="absolute bg-red-800 h-10 w-full z-0 rounded-l-lg" />
            </div>

          <div class="bg-black/50 p-0.5 rounded-lg m-2 [clip-path:polygon(0_0,100%_0,100%_100%,9%_100%,0_89%)] drop-shadow-lg">
              <div class="bg-slate-400 rounded-md p-10 pb-6 [clip-path:polygon(0_0,100%_0,100%_100%,9%_100%,0_89%)]">
                <div class="flex flex-row my-3 -mt-4.5 justify-center gap-3">
                  <span class="bg-red-600 w-2 h-2 rounded-full" />
                  <span class="bg-red-600 w-2 h-2 rounded-full" />
                </div>
                <div class="flex flex-col justify-center bg-white p-4 px-12 rounded-md drop-shadow-lg shadow-lg">
                  <span class=" absolute flex justify-end text-yellow-400 top-0 right-0">
                    <img :src="img.sparkles" class="object-contain relative w-10 p-1" :class="pokemon?.isShiny ? 'opacity-100' : 'opacity-0'" />
                  </span>

                  <img v-if="!isOpen" :src="pokemon?.isShiny && pokemon?.currentSprite ? shinyUrl(pokemon?.currentSprite) ?? undefined : pokemon?.currentSprite ?? undefined" :alt="pokemon?.nameFr" :class="!pokemon?.isShiny && !pokemon?.isOwned ? 'grayscale' : ''" class="w-48 h-48 object-contain mt-5" draggable="false" />

                  <div v-show="isOpen" class="h-48 w-48 flex items-center justify-center object-contain mt-5">
                    <LazySpriteChoose v-if="pokemon" ref="sprites" :pokemon="pokemon" @saved="onSpriteSaved" @close="isOpen = false" />
                  </div>

                  <div class="flex flex-row justify-items-start items-center gap-4 w-full max-w-48 pt-1 mt-3">
                    <span class="flex justify-end text-xs text-black">
                      #{{ pokemon?.pokeNumber }}
                    </span>
                    <h1 class="text-center text-xs font-bold">
                      {{ pokemon?.nameFr }}
                    </h1>
                  </div>
                </div>
                <div class="mt-2.5 flex flex-row items-center">
                  <button @click="isOpen = !isOpen" class="absolute mx-3 w-5 h-5 bg-red-600 rounded-full borderborder-red-950/50 hover:bg-red-700"></button>
                  <Reorder :size="40" class="ml-auto" />
                </div>
              </div>
            </div>

          <div class="flex flex-row items-center gap-2 my-4 ml-15">
            <div class="flex flex-row justify-between gap-5 text-black">
              <div class="flex flex-col gap-1 items-center">
                <button @click="changeShiny" :disabled="!pokemon" class="w-20 h-6 p-1 fit flex items-center  justify-center text-[6.5px] text-center border transition-colors rounded-xl bg-red-500  border-black/50 hover:bg-red-400 disabled:cursor-not-allowed"><img src="/img/diverse/sparkles.png" class="h-full w-auto object-contain" /></button>
              </div>

              <div class="flex flex-col gap-1 items-center">
                <button @click="changeOwned()" :disabled="!pokemon" class="w-20 h-6 flex items-center justify-center text-[6.5px] text-center border transition-colors rounded-xl bg-blue-400  border-black/50 hover:bg-blue-300 disabled:cursor-not-allowed"><img src="/poke_icon.png" class="h-full w-auto object-contain p-0.5" /></button>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center gap-6">
            <div class="grid grid-cols-3 grid-rows-3 bg-transparent place-items-center">
              <button @click="save" class="col-start-2 row-start-1 w-10 h-10 bg-black/90 flex items-center rounded-full justify-center -ml-4 border border-transparent text-white text-xs hover:bg-black/70 hover:border-slate-800" />
            </div>

            <div class="grid grid-cols-2 grid-rows-3 bg-green-500/90 place-items-center -ml-6 py-2 px-1 rounded-sm w-25 h-15"></div>

            <div class="grid grid-cols-3 grid-rows-3 bg-transparent place-items-center">
              <button @click="" class="col-start-2 row-start-1 w-10 h-10 bg-black/90  flex items-center justify-center text-white text-xs hover:bg-black/70 hover:border-slate-900" />
              <button @click="scrollPrev" :disabled="!isOpen" class="col-start-1 row-start-2 w-10 h-10 bg-black/90  flex items-center justify-center text-white text-xs hover:bg-black/70 hover:border-slate-900" />
              <span class="col-start-2 row-start-2 w-10 h-10 bg-black/90 flex items-center justify-center text-white text-xs" />
              <button @click="scrollNext" :disabled="!isOpen" class="col-start-3 row-start-2 w-10 h-10 bg-black/90  flex items-center justify-center text-white text-xs hover:bg-black/70 hover:border-slate-900" />
              <button @click="" class="col-start-2 row-start-3 w-10 h-10 bg-black/90  flex items-center justify-center text-white text-xs hover:bg-black/70 hover:border-slate-900" />
            </div>
          </div>
        </div>
      </div>
      <span class="bg-red-800 h-auto w-8"></span>
      <div class="flex flex-col justify-end">
        <div class="[clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] bg-red-600 w-50 h-8"></div>
        <div class="flex flex-col p-6 rounded-r-lg h-fit pt-15 bg-red-600">
          <div class="flex flex-col justify-between gap-11.5 bg-red-600">
            <div ref="screen" class="relative w-full h-30 min-h-0 flex flex-col overflow-hidden">
              <div v-if="display === 0 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Description pokedex
              </div>

              <div v-if="display === 1" class="flex flex-row justify-center items-center bg-white max-w-full h-full">
                <NuxtLink v-for="stage in pokemon?.evolutionChain ?? []"
                          :key="stage.pokeNumber" :to="`/pokedex/${stage.pokeNumber}`"
                          class="flex flex-col items-center p-1 border-[3px] bg-white pt-2 pb-2 px-2 shrink-0"
                          :class="stage.pokeNumber === pokemon?.pokeNumber ? 'border-blue-500 ' : 'border-white'">
                  <img :src="stage.currentSprite ?? undefined" class="w-19 object-contain bg-white" />
                </NuxtLink>
              </div>

              <div v-if="display === 2 && pokemon" class="flex flex-col gap-2 bg-green-500 p-2 max-w-full full ">
                <div><span>></span><span>{{ text.stats.hp }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "hp")].value }}</span></div>
                <div><span>></span><span>{{ text.stats.attack }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "attack")].value }}</span></div>
                <div><span>></span><span>{{ text.stats.defense }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "defense")].value }}</span></div>
                <div><span>></span><span>{{ text.stats.specialAttack }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-attack")].value }}</span></div>
                <div><span>></span><span>{{ text.stats.specialDefense }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "special-defense")].value }}</span></div>
                <div><span>></span><span>{{ text.stats.speed }}: </span><span>{{ pokemon?.stats[pokemon?.stats.findIndex(stat => stat.name === "speed")].value }}</span></div>
              </div>

              <div v-if="display === 3 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Faiblesses & resistances
              </div>

              <div v-if="display === 4 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                <div v-if="pokemon" class="flex flex-row justify-between items-center gap-2">
                  <div class="flex flex-col items-start gap-1">
                    <div class="flex flex-row gap-3 items-center text-xs text-black"><RulerDimensionLine class="rotate-90" />{{ pokemon?.height / 10 }} m</div>
                    <div class="flex flex-row gap-3 items-center text-xs text-black"><Weight />{{ pokemon?.weight / 10 }} kg</div>
                  </div>

                  <div class="flex flex-col justify-center items-center gap-1">
                    <div>
                      <img :src="typeIcon(pokemon.types[0]!)" class="max-h-8" />
                    </div>
                    <div v-if="pokemon?.types.length > 1">
                      <img :src="typeIcon(pokemon.types[1]!)" class="max-h-8" />
                    </div>
                    <div v-else class="min-h-8" />
                  </div>
                </div>
              </div>

              <div v-if="display === 5 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Liste capacités par niveau
              </div>

              <div v-if="display === 6 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Talent & capacité spé
              </div>

              <div v-if="display === 7 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                CT & CS apprenable
              </div>

              <div v-if="display === 8 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Methode et taux de capture
              </div>

              <div v-if="display === 9 && pokemon" class="flex flex-col justify-center items-center bg-white max-w-full h-full">
                Jeux de capture
              </div>
            </div>

            <div class="flex flex-col flex-wrap items-end mx-auto gap-3 w-fit">
              <div class="grid grid-cols-5 gap-0.5 p-0.5 bg-black/80">
                <button @click="changeDisplay(nb-1)" v-for="nb in 10" :key="nb" class="w-10 h-10" :class="freeDisplay.includes(nb-1) ? display === nb-1 ? 'bg-blue-600' : 'bg-blue-500 active:bg-blue-600 hover:bg-blue-700' : 'bg-slate-500 hover:bg-slate-700 active:bg-slate-600'" :disabled="!freeDisplay.includes(nb-1)" />
              </div>
              <div class="flex flex-row gap-2">
                <button class="bg-black rounded-full w-12 h-3 hover:bg-slate-800" @click="display = ( display - 1 + freeDisplay.length  ) % freeDisplay.length" />
                <button class="bg-black rounded-full w-12 h-3 hover:bg-slate-800" @click="display = ( display + 1 )  % freeDisplay.length" />
              </div>
            </div>

            <div class="flex flex-row justify-between m-2">
              <div class="flex flex-row">
                <button class="bg-white rounded-xs border border-black/60 w-10 h-10 hover:bg-slate-700 active:bg-slate-500"  />
                <button class="bg-white rounded-xs border border-black/60 w-10 h-10 hover:bg-slate-700 active:bg-slate-500"  />
              </div>
              <button class="btn bg-yellow-500 rounded-full w-8 h-8" />
            </div>

            <div v-if="pokemon" class="flex flex-row items-center justify-between gap-6 mb-6 text-white">
                <NuxtLink :disable="pokemon!.id > 1" :to="`/pokedex/${pokemon!.id-1}`">
                  <div class="bg-slate-800 text-slate-400 p-4 px-12 rounded-lg">
                    {{ text.pokedexDetail.prev }}
                  </div>
                </NuxtLink>

                <NuxtLink v-if="pokemon && pokemon?.id < MAX_ID_POKE" :to="`/pokedex/${pokemon?.id+1}`">
                  <div class="bg-slate-800 text-slate-400 p-4 px-12 rounded-lg">
                    {{ text.pokedexDetail.next }}
                  </div>
                </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>

<script setup lang="ts">
import type { AvailableGames } from "~/components/spriteChoose.vue";
import { Weight, RulerDimensionLine  } from 'lucide-vue-next'
import {shinyUrl} from "#server/utils/sprite";
import type { EvolutionStage } from "~/server/utils/evolution";
import { ref, useTemplateRef } from "vue";
import { Reorder } from 'reicon-vue';

const { img, text, typeIcon } = useLang()

const route = useRoute()
const id = route.params.id
const isOpen = ref(false)
const MAX_ID_POKE = 1025
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
const freeDisplay = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const display = ref(1)

function changeDisplay(value: number) {
  display.value = value
}

function onSpriteSaved() {
  refresh()
}

const spriteRef = useTemplateRef('sprites')

const scrollNext = () => {
  if (spriteRef.value) {
    spriteRef.value.scrollNext()
  }
}

const scrollPrev = () => {
  if (spriteRef.value) {
    spriteRef.value.scrollPrev()
  }
}

const save = () => {
  if (spriteRef.value) {
    spriteRef.value.saveCurrent()
  }
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