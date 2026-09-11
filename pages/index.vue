<script setup lang="ts">
</script>
<template>
  <div class="max-w-4xl mx-auto p-6">

    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">Hub</h1>
      <p class="text-lg text-slate-600">
        Accédez à toutes les fonctionnalités de Pokesoul !
      </p>
    </section>

    <section class="mb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink to="/pokedex"
                  class="group flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border border-slate-200
           shadow-sm border-blue-300">
          <span class="text-lg font-semibold">Pokedex</span>
          <span class="text-sm text-slate-500 text-center">Explorez tous les Pokémon</span>
        </NuxtLink>
        <NuxtLink to="/games"
                  class="group flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border border-slate-200
           shadow-sm border-red-300">
          <span class="text-lg font-semibold">Jeux</span>
          <span class="text-sm text-slate-500 text-center">Gérez vos jeux et sauvegardes</span>
        </NuxtLink>
      </div>

    </section>


  </div>
</template>