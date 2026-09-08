<template>
  <LoadingPage :loading="loading" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const loading = ref(false)

const router = useRouter()

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  loading.value = false
})
</script>