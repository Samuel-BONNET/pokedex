<script setup lang="ts">
</script>
<template>
  <div class="fixed inset-0 -z-10 bg-[url('/background.png')] bg-repeat-y bg-[length:100%_auto]" />

  <Header class="relative z-10" />

  <div class="relative z-10 grid grid-cols-3">
    <main class="col-span-3 ml-0 lg:ml-20">
      <slot />
    </main>
  </div>
</template>