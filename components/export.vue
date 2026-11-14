<template>
  <button class="block text-transparent w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer border-2 border-neutral-900 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" @click="getCSV()">Export CSV</button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth.ts";

async function getCSV() {
  const {isConnected, user} = useAuth()

  if (!isConnected.value || !user.value) {
    console.log('User not found')
    return
  }

  window.open(`/api/statut/export?userId=${user.value.id}`, '_blank')
}
</script>