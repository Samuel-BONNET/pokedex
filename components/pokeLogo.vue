<template>
  <div class="relative inline-flex items-center justify-center m-6 sm:m-12 select-none">
    <Option class="absolute top-0 left-245 mx-4 z-30" />
    <img :src="img.logo" :alt="text.alt.logo" class="relative h-20 sm:h-50 w-auto max-w-full object-contain z-10" />

    <img v-if="diverse.mascotRight" :src="diverse.mascotRight" :alt="text.alt.mascotRight" class="absolute -right-6 sm:-right-50 -bottom-25 sm:-bottom-30 z-10 drop-shadow-md pointer-events-none rotate-5 object-contain" :class="[themeClassesRightImageSize, themeClassesPositionRightImage]" />

    <img v-if="diverse.mascotLeft" :src="diverse.mascotLeft" :alt="text.alt.mascotLeft" class="absolute aspect-square object-contain z-0 drop-shadow-md pointer-events-none" :class="[themeClassesLogoImageSize, themeClassesPositionLogoImage]" />

  </div>


</template>

<style scoped>
</style>

<script setup lang="ts">
const { img, text, diverse, themeClassesLogoImageSize, themeClassesRightImageSize, themeClassesPositionRightImage, themeClassesPositionLogoImage } = useLang()
</script>
