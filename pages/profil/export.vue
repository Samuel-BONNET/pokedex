<template>
  <button class="bg-white text-slate-800 border-slate-800" @click="getCSV()">Export CSV</button>
</template>

<style scoped>

</style>

<script setup lang="ts">
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