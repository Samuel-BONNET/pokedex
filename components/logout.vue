<template>
  <button @click="logout">
    Logout
  </button>
</template>

<style scoped>

</style>

<script setup lang="ts">

async function logout() {
  localStorage.removeItem('token')
  await navigateTo('/')
}
</script>