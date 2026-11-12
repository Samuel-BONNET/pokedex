<template>
  <LoadingPage :loading="loading" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import {useGlobalLoader} from "~/composables/useGlobalLoader.ts";

const { loading: globalLoading } = useGlobalLoader()
const loading = ref(false)

const router = useRouter()

router.beforeEach(() => {
  loading.value = true
})

router.afterEach(() => {
  loading.value = false
})

const combinedLoading = computed(() => loading.value || globalLoading.value)
</script>