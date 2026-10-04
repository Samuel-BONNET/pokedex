<template>
  <div class="flex flex-col">
    <NuxtLink to="/profil/export">Export CSV</NuxtLink>
    <NuxtLink to="/profil/import">Import CSV</NuxtLink>
  </div>
  <DresseurCard />
</template>

<style scoped>

</style>

<script setup lang="ts">

import Export from "~/pages/profil/export.vue";
</script>