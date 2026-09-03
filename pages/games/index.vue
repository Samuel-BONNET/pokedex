<template>

  <section class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Games
    </h1>

    <p class="text-lg">
      Gérez vos sauvegardes ici<br>
      Choississez un jeu
    </p>
  </section>


  <div class="relative">
    <button @click="prev" class="z-10 absolute top-1/2 left-2 -translate-y-1/2">< left</button>
    <div class="overflow-hidden">
      <div class="flex" :style="{ transform: `translateX(calc(${-currentIndex} * 160px + 50vw + 72px))` , transition: canAnimate ? 'transform .3s ease' : 'none' }">
        <div v-for="g in loopedGames" :key="g.id" class="shrink-0">
          <NuxtLink class="block" :to="`/games/${g.id}`">
            <GameCard :game="g" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <button @click="next" class="absolute top-1/2 right-2 -translate-y-1/2">right ></button>
  </div>

</template>

<script setup lang="ts">
const { user } = useAuth()
const { data: games } = await useFetch('/api/games', {
  query: { userId: user.value?.id }
})
const filteredGames = computed(() => (games.value ?? []).filter(g => g.currentSprite))

const loopedGames = computed(() =>  [...filteredGames.value, ...filteredGames.value, ...filteredGames.value])

const currentIndex = ref(filteredGames.value.length - 1)
const canAnimate = ref(true)

function prev() {
  if (currentIndex.value <= filteredGames.value.length) {
    canAnimate.value = false
    currentIndex.value += filteredGames.value.length + 1
    setTimeout(() => {
      canAnimate.value = true
      currentIndex.value--
    }, 20)
    return
  }
  currentIndex.value--
  console.log(currentIndex.value)
}

function next() {
  if (currentIndex.value >=  2 * filteredGames.value.length - 1) {
    canAnimate.value = false
    currentIndex.value -= filteredGames.value.length - 1
    setTimeout(() => {
      canAnimate.value = true
      currentIndex.value++
    }, 20)
    return
  }
  currentIndex.value++
  console.log(currentIndex.value)
}

</script>

<style scoped>

</style>