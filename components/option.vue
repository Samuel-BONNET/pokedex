<template>
  <div ref="root" class="relative flex flex-col items-center w-fit self-start">
    <button type="button"
            class="flex items-center gap-2 p-2 cursor-pointer"
            :class="[themeClassesMainBackground, open ? 'ring-2 ring-offset-1 ring-gray-400' : '']"
            :aria-expanded="open"
            aria-haspopup="true"
            @click="open = !open">
      <Menu class="h-6 w-6 text-gray-800" />
    </button>

    <Transition name="menu">
      <div v-if="open" class="absolute items-center gap-1.5 px-2 top-full mt-2 z-20 w-fit max-h-100 overflow-y-auto border border-black/10 py-1 bg-slate-600 text-gray-800 shadow-xl flex flex-col">
        <NuxtLink v-if="!isConnected" to="/login">{{ text.auth.login }}</NuxtLink>
        <NuxtLink v-if="!isProfil && isConnected" to="/profil">{{ text.auth.profil }}</NuxtLink>
        <Logout v-if="isConnected" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { Check, ChevronDown, Menu } from 'lucide-vue-next'
import lang from '~/data/lang.json'
import {useAuth} from "~/composables/useAuth.ts";

const { text, themeClassesMainBackground } = useLang()
const { isConnected } = useAuth()
const route = useRoute()
const isProfil = computed(() => route.path === "/profil")
const root = ref<HTMLElement | null>(null)
const open = ref(false)


function onPointerDown(event: MouseEvent | TouchEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('click', onPointerDown))
</script>