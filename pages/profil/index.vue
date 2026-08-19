<template>
  <div class="flex flex-col">
    <h1>Profil</h1>
    <NuxtLink to="/profil/import">Export CSV</NuxtLink>
    <NuxtLink to="/profil/import">Import CSV</NuxtLink>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">

import Export from "~/pages/profil/export.vue";
</script>