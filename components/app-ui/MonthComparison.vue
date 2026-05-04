<template>
  <div class="card">
    <h3>{{ currentMonthName }} vs {{ prevMonthName }}</h3>
    <div class="flex flex-col gap-5 mt-1">
      <div>
        <div class="comp-label">Tasks</div>
        <div class="comp-row">
          <span>{{ currentMonthName }}: <b>{{ data.thisMonth.count }}</b></span>
          <span class="opacity-55">{{ prevMonthName }}: {{ data.lastMonth.count }}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: tasksPct + '%', backgroundColor: 'var(--primary-color)' }"></div>
        </div>
        <div class="delta" :class="tasksDelta >= 0 ? 'positive' : 'negative'">
          {{ tasksDelta >= 0 ? '+' : '' }}{{ tasksDelta }} vs last month
        </div>
      </div>
      <div>
        <div class="comp-label">Income</div>
        <div class="comp-row">
          <span>{{ currentMonthName }}: <b>{{ data.thisMonth.income.toFixed(0) }}</b></span>
          <span class="opacity-55">{{ prevMonthName }}: {{ data.lastMonth.income.toFixed(0) }}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: incomePct + '%', backgroundColor: 'var(--accent-color)' }"></div>
        </div>
        <div class="delta" :class="incomeDelta >= 0 ? 'positive' : 'negative'">
          {{ incomeDelta >= 0 ? '+' : '' }}{{ incomeDelta.toFixed(0) }} vs last month
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { labelsMonths } from '~/composables/useAnalytics';

const props = defineProps<{
  data: {
    thisMonth: { count: number; income: number };
    lastMonth: { count: number; income: number };
  };
}>();

const today = new Date();
const currentMonthName = labelsMonths[today.getMonth()];
const prevMonthName = labelsMonths[today.getMonth() === 0 ? 11 : today.getMonth() - 1];

const tasksPct = computed(() => {
  const max = Math.max(props.data.thisMonth.count, props.data.lastMonth.count);
  return max > 0 ? Math.round((props.data.thisMonth.count / max) * 100) : 0;
});

const incomePct = computed(() => {
  const max = Math.max(props.data.thisMonth.income, props.data.lastMonth.income);
  return max > 0 ? Math.round((props.data.thisMonth.income / max) * 100) : 0;
});

const tasksDelta = computed(() => props.data.thisMonth.count - props.data.lastMonth.count);
const incomeDelta = computed(() => props.data.thisMonth.income - props.data.lastMonth.income);
</script>

<style scoped>
.comp-label { font-size: 0.7rem; opacity: 0.55; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; font-weight: 700; }
.comp-row { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.4rem; }
.progress-track { width: 100%; height: 6px; border-radius: 3px; background-color: rgba(var(--divider-color)); }
.progress-fill { height: 6px; border-radius: 3px; transition: width 0.4s ease; }
.delta { font-size: 0.75rem; margin-top: 0.3rem; }
.positive { color: var(--primary-color); }
.negative { color: #ef4444; }
</style>
