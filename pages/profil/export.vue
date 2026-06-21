<template>
  <button @click="getCSV()">Export CSV</button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import Import from "~/pages/profil/import.vue";
import {useAuth} from "~/composables/useAuth";

async function getCSV() {
  const {isConnected, user} = useAuth()

  if (!isConnected.value || !user.value) {
    console.log('User not found')
    return
  }

  window.open(`/api/statut/export?userId=${user.value.id}`, '_blank')
}
</script>