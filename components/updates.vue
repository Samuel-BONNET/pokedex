<template>
  <div v-if="data?.content" class="bg-white/40 rounded-3xl px-3 py-6 h-fit">
    <ul>
      <p class="text-center font-bold text-2xl" :class="themeClassesColor">
        {{ text.updates.patchNote }} <br>
        {{ text.updates.version }} : {{ version.split('-')[0]  }}.{{ version.split('-')[1] }}
      </p>
      <hr class="m-2 mx-4 mb-4 border" :class="themeClassesColor && themeClassesBorder">

      <div class="ml-4 text-2xl font-semibold">{{ title}}</div>

      <div v-for="l in lines" :key="l" class="ml-4">
        <div class="flex items-start gap-2 mt-3">
          <img :src="img.pokeIcon" class="h-5 w-5 object-contain shrink-0" :class="themeClassesHue" />
          <p class="leading-5 text-lg">{{ l }}</p>
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { img, themeClassesColor, themeClassesBorder, themeClassesHue, text } = useLang()
const { data } = await useFetch('/api/changelog')

const version = computed(() => data.value?.fileName?.split('v')[1]?.split('.md')[0] ?? '')
const title = computed(() => data.value?.title ?? '')
const lines = computed(() => data.value?.content?.split('\n') ?? [])
</script>

<style scoped>

</style>
