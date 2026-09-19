<template>
  <div v-if="route.path === '/'">
    <div class="flex flex-col items-center justify-center">
      <NuxtLink to="/">
        <img class="max-w-xl" src="/logo.png" />
      </NuxtLink>
    </div>
    <div class="flex flex-row items-center justify-center">
      <Navbar />
      <Login />
    </div>
  </div>
  <div v-else>
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-4">
        <NuxtLink to="/">
          <img class="max-w-xs m-4" src="/logo.png" />
        </NuxtLink>
        <Navbar />
      </div>
      <Login />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

</script>

<style scoped>

</style>