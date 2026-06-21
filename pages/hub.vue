<template>
  <h1>Hub</h1>
  <NuxtLink to="/pokedex">
    Pokedex
  </NuxtLink>
  <NuxtLink to="/profil">Profil</NuxtLink>
  <Logout />
</template>

<style scoped>

</style>

<script setup lang="ts">

import Index from "./profil/index.vue";
</script>