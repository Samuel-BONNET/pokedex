<template>
  <template v-if="!isConnected && !loginPage">
    <div class="absolute right-4 flex flex-row gap-2 items-end text-white m-4 p-2 bg-green-500 rounded-xl">
      <NuxtLink to="/login">
        Login
      </NuxtLink>
      <NuxtLink to="/login?mode=register">
        Register
      </NuxtLink>
    </div>
  </template>
  <template v-if="isConnected">
    <div class="absolute right-4 flex flex-col items-center text-white m-4 p-2 bg-green-500 rounded-xl">
      <NuxtLink v-if="!isProfil" to="/profil">Profil</NuxtLink>
      <Logout />
    </div>
  </template>
  <template v-else></template>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";
const { isConnected } = useAuth()

const route = useRoute()
const loginPage = computed(() => route.path === "/login")
const isProfil = computed(() => route.path === "/profil")

</script>