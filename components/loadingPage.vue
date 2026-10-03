<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <img class="w-24 h-24" :src="img.remote.loadingPage" />
  </div>
</template>

<script setup lang="ts">
const { img } = useLang()

const props = withDefaults(defineProps<{
  loading: boolean
  delay?: number
}>(), {
  delay: 1000
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

watch(() => props.loading, (val) => {
  if (val) {
    timer = setTimeout(() => { visible.value = true }, props.delay)
  } else {
    if (timer) { clearTimeout(timer); timer = null }
    visible.value = false
  }
})

onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>