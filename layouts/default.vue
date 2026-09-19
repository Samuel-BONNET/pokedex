<template>
  <img src="/background.png" class="absolute inset-0 w-full h-full object-cover -z-10" />

  <Header class="relative z-10" />

  <div class="relative z-10 grid grid-cols-3">
    <main class="col-span-3 ml-0 lg:ml-20">
      <slot />
    </main>
  </div>
</template>