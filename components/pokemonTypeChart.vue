<template>
  <div class="grid grid-flow-col grid-rows-2 gap-x-3 gap-y-1">
    <template v-for="level in TYPE_CHART_COLUMNS" :key="level">
      <span class="text-center text-[10px] font-bold text-slate-600">{{ labels[level] }}</span>
      <div class="flex flex-row flex-wrap items-center justify-center gap-1">
        <img v-for="type in effectiveness[level]" :key="type" :src="typeIcon(type)" :alt="type" :title="type"
             class="object-contain max-h-5" />
        <span v-if="!effectiveness[level].length" class="text-[10px] text-slate-400">—</span>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { TYPE_CHART_COLUMNS, getTypeEffectiveness, type Effectiveness } from '~/utils/typeChart'

const props = defineProps<{ types: string[] }>()
const { text, typeIcon } = useLang()

const effectiveness = computed(() => getTypeEffectiveness(props.types))
const labels: Record<Effectiveness, string> = {
  4: text.pokedexDetail.typeChart.quadruple,
  2: text.pokedexDetail.typeChart.double,
  1: text.pokedexDetail.typeChart.neutral,
  0.5: text.pokedexDetail.typeChart.half,
  0.25: text.pokedexDetail.typeChart.quarter,
  0: text.pokedexDetail.typeChart.none,
}
</script>
