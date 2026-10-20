<template>
  <div v-if="route.path === '/'">
    <div class="relative flex flex-col items-center justify-center">
      <poke-logo />
    </div>
    <div class="flex flex-row flex-wrap items-center justify-center gap-x-4">
      <Navbar />
    </div>
  </div>
  <div v-else>
    <div class="relative flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-4">
        <NuxtLink to="/">
          <img class="max-w-xs m-4" :src="img.logo" :alt="text.alt.logo" />
        </NuxtLink>
        <Navbar />
      </div>
      <Option class="absolute top-0 right-0 z-130 m-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { img, text } = useLang()

</script>

<style scoped>

</style>