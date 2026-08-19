<template>
  <button @click="logout">
    Logout
  </button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

const { logout: authLogout } = useAuth()

async function logout() {
  await authLogout()
}

</script>