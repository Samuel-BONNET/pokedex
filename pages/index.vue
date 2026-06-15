<template>
  <h1>Welcome</h1>
  <NuxtLink to="/login" v-if="isConnected()">
    Login
  </NuxtLink>
  <Logout v-else />
  <NuxtLink to="/register">
    Register
  </NuxtLink>
</template>

<style scoped>

</style>

<script setup lang="ts">
function isConnected(){
  if (import.meta.client) {
    return localStorage.getItem("token") !== null
  }
  return false
}
</script>