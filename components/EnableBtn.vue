<template>
  <div class="flex flex-row justify-between items-center gap-5 py-1">
    <h3>{{ props.text }}</h3>
    <button type="button" @click="props.action" class="w-fit px-4 py-2 text-xs font-bold bg-white text-neutral-800 border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0.5 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
      {{ enable ? 'Enable' : 'Disabled' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string, enable: boolean, action: () => void }>()
</script>

<style scoped>

</style>