<script setup lang="ts">
const { text } = useLang()
</script>
<template>
  <div class="max-w-4xl mx-auto p-6">

    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">
        {{ text.welcome.title }}
      </h1>

      <p class="text-lg">
        {{ text.welcome.tagline }}
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        {{ text.welcome.objective }}
      </h2>

      <p>
        {{ text.welcome.objectiveBody }}
      </p>

      <p class="mt-2">
        {{ text.welcome.eachPokemon }}
      </p>

      <ul class="list-disc ml-8 mt-2">
        <li>{{ text.welcome.owned }}</li>
        <li>{{ text.welcome.ownedShiny }}</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">
        {{ text.welcome.livingDex }}
      </h2>

      <p>
        {{ text.welcome.livingDexBody1 }}
      </p>

      <p class="mt-2">
        {{ text.welcome.livingDexBody2 }}
      </p>
    </section>

  </div>
</template>
