<template>
  <div class="card">
    <h3>Income per month</h3>
    <div v-if="data.length === 0">Waiting for data...</div>
    <Chart v-else :data="data" :size="chartConfig.chartSize" :margin="chartConfig.chartMargin" direction="horizontal">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Line :dataKeys="['month', 'count']" />
      </template>
      <template #widgets>
        <Tooltip :borderColor="chartConfig.tooltipConfig.borderColor" :config="{
          month: { color: chartConfig.tooltipConfig.defaultColors.primary },
          count: { label: 'average', color: chartConfig.tooltipConfig.defaultColors.secondary },
        }" />
      </template>
    </Chart>
  </div>
</template>

<script setup lang="ts">
import { Chart, Grid, Line, Tooltip } from 'vue3-charts'
import { useChartConfig } from '~/composables/useChartConfig';
import type { TasksChart } from '~/types';

const props = defineProps<{
  data: TasksChart[]
}>();

const chartConfig = useChartConfig();
</script>
