<template>
  <template v-if="!isConnected && !loginPage">
    <div class="absolute right-4 flex flex-row gap-2 items-center items-end m-4">
      <NuxtLink to="/login">
        Login
      </NuxtLink>
      <NuxtLink to="/login?mode=register">
        Register
      </NuxtLink>
    </div>
  </template>
  <template v-if="isConnected">
    <div class="absolute right-4 flex flex-col items-center items-end m-4">
      <NuxtLink to="/profil">Profil</NuxtLink>
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
</script>