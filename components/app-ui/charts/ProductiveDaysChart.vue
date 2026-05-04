<template>
  <div class="card">
    <h3>Productive days</h3>
    <div v-if="!hasData" class="text-sm opacity-50">Waiting for data...</div>
    <Chart v-else :data="data" :size="chartConfig.chartSize" :margin="chartConfig.chartMargin" direction="horizontal">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Bar :dataKeys="['day', 'count']" :barStyle="{ fill: 'var(--accent-color)' }" />
      </template>
      <template #widgets>
        <Tooltip
          :borderColor="chartConfig.tooltipConfig.borderColor"
          :config="{
            day: { color: chartConfig.tooltipConfig.defaultColors.primary },
            count: { label: 'tasks', color: chartConfig.tooltipConfig.defaultColors.secondary },
          }"
        />
      </template>
    </Chart>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Chart, Grid, Bar, Tooltip } from 'vue3-charts';
import { useChartConfig } from '~/composables/useChartConfig';

const props = defineProps<{
  data: { day: string; count: number }[];
}>();

const chartConfig = useChartConfig();
const hasData = computed(() => props.data.some(d => d.count > 0));
</script>
