<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <div v-if="data.length === 0">Waiting for data...</div>
    <Chart v-else :data="data" :size="chartConfig.chartSize" :margin="chartConfig.chartMargin" direction="horizontal">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Bar :dataKeys="['clientId', 'count']" :barStyle="{ fill: 'var(--primary-color)' }" />
      </template>
      <template #widgets>
        <Tooltip :borderColor="chartConfig.tooltipConfig.borderColor" :config="{
          clientId: { color: chartConfig.tooltipConfig.defaultColors.primary },
          count: { label: 'average', color: chartConfig.tooltipConfig.defaultColors.secondary },
        }" />
      </template>
    </Chart>
  </div>
</template>

<script setup lang="ts">
import { Chart, Grid, Bar, Tooltip } from 'vue3-charts';
import { useChartConfig } from '~/composables/useChartConfig';
import type { TasksChart } from '~/types';

const props = defineProps<{
  data: TasksChart[]
  title: string
}>();

const chartConfig = useChartConfig();
</script>