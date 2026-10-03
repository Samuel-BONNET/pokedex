<template>
  <button @click="logout">
    {{ text.auth.logout }}
  </button>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

const { logout: authLogout } = useAuth()
const { text } = useLang()

async function logout() {
  await authLogout()
}

</script>