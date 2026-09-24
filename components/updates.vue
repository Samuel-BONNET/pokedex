<template>
  <div v-if="data?.content" class="bg-white/40 rounded-3xl px-3 py-6 h-fit">
    <ul>
      <p class="text-center text-blue-500 font-bold text-2xl ">
        Patch Note <br>
        Version : {{ version.split('-')[0]  }}.{{ version.split('-')[1] }}
      </p>
      <hr class="text-blue-400 m-2 mx-4 mb-4 border border-blue-400">

      <div class="ml-4 text-2xl font-semibold">{{ title}}</div>

      <div v-for="l in lines" :key="l" class="ml-4">
        <div class="flex items-start gap-2 mt-3">
          <img src="/poke_icon.png" class="h-5 w-5 object-contain shrink-0" />
          <p class="leading-5 text-lg">{{ l }}</p>
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/changelog')

const version = computed(() => data.value?.fileName?.split('v')[1]?.split('.md')[0] ?? '')
const title = computed(() => data.value?.title ?? '')
const lines = computed(() => data.value?.content?.split('\n') ?? [])
</script>

<style scoped>

</style>
