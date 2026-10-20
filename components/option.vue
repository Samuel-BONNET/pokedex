<template>
  <div ref="root" class="relative flex flex-col items-center w-fit self-start font-mono">
    <button type="button"
            class="flex items-center justify-center p-2 bg-neutral-300 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-200 transition-all cursor-pointer"
            :class="open ? 'bg-neutral-400 translate-y-0.5 shadow-none' : ''"
            :aria-expanded="open"
            aria-haspopup="true"
            @click="open = !open">
      <Menu class="h-6 w-6 text-neutral-900" />
    </button>

    <Transition name="menu">
      <div v-if="open" class="absolute right-0 top-full mt-2 z-30 w-48 bg-neutral-300 border-4 border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex flex-col gap-1.5 text-xs font-bold text-neutral-900">
        <NuxtLink v-if="!isConnected || isGuest" to="/login" class="px-3 py-2 bg-white border-2 border-neutral-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-100 text-center">
          {{ text.auth.login }}
        </NuxtLink>
        <NuxtLink v-if="isConnected && !isGuest" to="/profil" class="px-3 py-2 bg-white border-2 border-neutral-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-100 text-center">
          {{ text.auth.profil }}
        </NuxtLink>
        <NuxtLink to="/settings" class="px-3 py-2 bg-white border-2 border-neutral-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-100 text-center">
          {{ text.auth.settings}}
        </NuxtLink>
        <Logout v-if="isConnected && !isGuest" class="w-full text-center px-3 py-2 bg-white border-2 border-neutral-700 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-100" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import {useAuth} from "~/composables/useAuth.ts";

const { text } = useLang()
const { isConnected, isGuest } = useAuth()
const root = ref<HTMLElement | null>(null)
const open = ref(false)


function onPointerDown(event: MouseEvent | TouchEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('click', onPointerDown))
</script>