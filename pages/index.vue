<script setup lang="ts">
const { img, text, diverse, themeClassesColor, themeClassesBorder, themeClassesPositionLeftImage } = useLang()
</script>
<template>
  <div class="relative max-w-6xl mx-auto p-6">

    <section class="flex flex-col lg:flex-row gap-4 lg:gap-2 mb-8">

      <div v-if="diverse.hero" class="hidden lg:flex w-80 shrink-0 justify-center absolute -top-30 -left-30 pointer-events-none z-0" :class="themeClassesPositionLeftImage">
        <img :src="diverse.hero" class="pointer-events-none object-contain w-full h-auto scale-x-90 scale-y-90" :alt="text.alt.hero" />
      </div>

      <div class="rounded-md px-3 w-full lg:w-2/3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">

          <div class="flex flex-col p-4 h-full rounded border-black/20 border-[3px]" :class="themeClassesColor">
            <img :src="img.badges.welcome" class="w-full max-w-35 h-auto self-center mb-5" />
            <p class="text-xl text-white"><span class="font-bold">{{ text.home.cards.welcome.lead }}</span><br>
              {{ text.home.cards.welcome.body }}
            </p>
          </div>

          <NuxtLink to="/games">
            <div class="flex flex-col p-4 border h-full  bg-white/30 rounded" :class="themeClassesBorder">
              <img :src="img.badges.backup" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl my-auto">
                <template v-if="text.home.cards.backup.lead">{{ text.home.cards.backup.lead }} </template>
                <span class="font-bold ml-2" :class="themeClassesColor">{{ text.home.cards.backup.highlight }}</span><br>
                {{ text.home.cards.backup.body }}
              </p>
            </div>
          </NuxtLink>

          <NuxtLink to="/pokedex">
            <div class="flex flex-col p-4 border h-full bg-white/30 rounded hover:size-1" :class="themeClassesBorder">
              <img :src="img.badges.pokedex" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl">
                <template v-if="text.home.cards.pokedex.lead">{{ text.home.cards.pokedex.lead }} </template>
                <span class="font-bold mx-2" :class="themeClassesColor">{{ text.home.cards.pokedex.highlight }}</span>
                <template v-if="text.home.cards.pokedex.trail"> {{ text.home.cards.pokedex.trail }}</template>
                <br>
                {{ text.home.cards.pokedex.body }}
              </p>
            </div>
          </NuxtLink>

          <NuxtLink to="/preferences">
            <div class="flex flex-col p-4 border h-full bg-white/50 rounded" :class="themeClassesBorder">
              <img :src="img.badges.customize" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl">
                <span class="font-bold mr-2" :class="themeClassesColor">{{ text.home.cards.customize.highlight }}</span>
                <template v-if="text.home.cards.customize.trail"> {{ text.home.cards.customize.trail }}</template>
                <br>
                {{ text.home.cards.customize.body }}
              </p>
            </div>
          </NuxtLink>

        </div>
      </div>

      <updates class="w-full lg:w-1/3" />
    </section>

  </div>
</template>
