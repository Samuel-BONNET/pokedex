<template>
  <div class="flex justify-center items-center w-full">
    <ul v-for="s in spriteList" :key="s.name">
      <div v-if="s.sprite">
        <img :src="s.sprite" />
        <p>{{ s.name }}</p>
      </div>
    </ul>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
const props = defineProps<{
  game: { id: number }
  availableJaquettes?: { name: string , sprite: string }[]
}>()

const spriteList = computed(() => props.availableJaquettes ?? [])
</script>