<script setup lang="ts">
const { img, themeClassesMainBackground, themeBackgroundImage } = useLang()
</script>
<template>
  <div :class="themeClassesMainBackground"
       :style="themeBackgroundImage ? { backgroundImage: `url('${img.background}')` } : undefined"
       class="fixed inset-0 -z-10 bg-repeat-y bg-size-[100%_auto]" />

  <div class="relative z-10 flex min-h-screen flex-col">
    <Header />

    <div class="grid grow grid-cols-3">
      <main class="col-span-3 ml-0 lg:ml-20">
        <slot />
      </main>
    </div>
  </div>
  <Footer />
</template>
