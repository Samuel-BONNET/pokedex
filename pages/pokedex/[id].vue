<template>
  <div>
    {{ pokemon?.nameFr }}
    <img :src="pokemon?.currentSprite" />
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { data: pokemon } = await useFetch(`/api/pokemon/${id}`)
</script>