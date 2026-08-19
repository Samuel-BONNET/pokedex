<template>
  <template v-if="!isConnected">
    <div class="absolute right-4 flex flex-col items-center items-end m-4">
      <NuxtLink to="/login">
        Login
      </NuxtLink>
      <NuxtLink to="/register">
        Register
      </NuxtLink>
    </div>
  </template>
  <template v-else>
    <div class="absolute right-4 flex flex-col items-center items-end m-4">
      <NuxtLink to="/profil">Profil</NuxtLink>
      <Logout />
    </div>
  </template>
</template>

<style scoped>

</style>

<script setup lang="ts">
import {useAuth} from "~/composables/useAuth";

const { isConnected } = useAuth()
</script>