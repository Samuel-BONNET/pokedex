<template>
  <button @click="getCSV()">Export CSV</button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import Import from "~/pages/profil/import.vue";

async function getCSV() {
  const token = localStorage.getItem('token')

  if (!token) {
    console.error('User not found')
    return
  }

  const userData = await $fetch<{ userId: number }>('/api/user/me', {
    headers: {Authorization: `Bearer ${token}`},
  })

  window.open(`/api/statut/export?userId=${userData.userId}`, '_blank')
}
</script>