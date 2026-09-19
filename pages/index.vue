<script setup lang="ts">
</script>
<template>
  <div class="relative max-w-6xl mx-auto p-6">

    <section class="flex flex-col lg:flex-row gap-4 lg:gap-2 mb-8">

      <div class="hidden lg:flex w-80 flex-shrink-0 justify-center absolute -top-30 -left-30 pointer-events-none -z-0">
        <img src="/img/diverse/lugia.png" class="pointer-events-none object-contain w-full h-auto -scale-x-100" alt="Lugia" />
      </div>

      <div class="rounded-md px-3 w-full lg:w-2/3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">

          <div class="flex flex-col p-4 border h-full border-blue-300 bg-blue-400 rounded">
            <img src="/badge2.png" class="w-full max-w-35 h-auto self-center mb-5" />
            <p class="text-xl text-white"><span class="font-bold">Bienvenue sur PokeMind</span><br>
              Votre outil de gestion de collection pokemon et bien plus !
            </p>
          </div>

          <NuxtLink to="/games">
            <div class="flex flex-col p-4 border h-full border-green-300 bg-white/30 rounded">
              <img src="/badge1.png" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl my-auto">Archivez vos <span class="font-bold text-blue-500">Sauvegardes</span><br>
                Pour chaque jeux ayez un aperçu des sauvegardes
              </p>
            </div>
          </NuxtLink>

          <NuxtLink to="/pokedex">
            <div class="flex flex-col p-4 border h-full border-green-300 bg-white/30 rounded">
              <img src="/badge3.png" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl">Complétez le <span class="font-bold text-blue-500">Pokedex</span> ! <br>
                Enregistrez vos pokemon, vos shiny avec leurs informations de capture...
              </p>
            </div>
          </NuxtLink>

          <NuxtLink to="/preferences">
            <div class="flex flex-col p-4 border h-full border-blue-300 bg-white/50 rounded">
              <img src="/badge4.png" class="w-full max-w-35 h-auto ml-auto mb-5" />
              <p class="text-xl"><span class="font-bold text-blue-500">Personnalisez</span> votre expérience <br>
                Choisissez vos sprites de pokemons et jeux préférés et bien plus !
              </p>
            </div>
          </NuxtLink>

        </div>
      </div>

      <updates class="w-full lg:w-1/3" />
    </section>

  </div>
</template>