<template>
  <button @click="logout">
    Logout
  </button>
</template>

<style scoped>

</style>

<script setup lang="ts">
const token = useCookie('token')

async function logout() {
  token.value = null
  await navigateTo('/')
}
</script>