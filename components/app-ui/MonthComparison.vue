<template>
  <div class="card">
    <h3>{{ currentMonthName }} vs {{ prevMonthName }}</h3>
    <div class="flex flex-col gap-4 mt-1">
      <div>
        <div class="comp-label">Tasks</div>
        <div class="comp-row">
          <div class="comp-values">
            <span class="comp-current">{{ data.thisMonth.count }}</span>
            <span class="comp-sep">vs</span>
            <span class="comp-prev">{{ data.lastMonth.count }}</span>
          </div>
          <span class="delta-chip" :class="tasksDelta >= 0 ? 'positive' : 'negative'">
            {{ tasksDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(tasksDelta) }}
          </span>
        </div>
        <div class="comp-tracks">
          <div class="track-row">
            <span class="track-label">{{ currentMonthName }}</span>
            <div class="progress-track flex-1">
              <div class="progress-fill" :style="{ width: tasksPct + '%', backgroundColor: 'var(--primary-color)' }"></div>
            </div>
          </div>
          <div class="track-row">
            <span class="track-label">{{ prevMonthName }}</span>
            <div class="progress-track flex-1">
              <div class="progress-fill" :style="{ width: tasksPrevPct + '%', backgroundColor: 'rgba(var(--divider-color))' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="comp-label">Income</div>
        <div class="comp-row">
          <div class="comp-values">
            <span class="comp-current">{{ data.thisMonth.income.toFixed(0) }}</span>
            <span class="comp-sep">vs</span>
            <span class="comp-prev">{{ data.lastMonth.income.toFixed(0) }}</span>
          </div>
          <span class="delta-chip" :class="incomeDelta >= 0 ? 'positive' : 'negative'">
            {{ incomeDelta >= 0 ? '↑' : '↓' }} {{ Math.abs(incomeDelta).toFixed(0) }}
          </span>
        </div>
        <div class="comp-tracks">
          <div class="track-row">
            <span class="track-label">{{ currentMonthName }}</span>
            <div class="progress-track flex-1">
              <div class="progress-fill" :style="{ width: incomePct + '%', backgroundColor: 'var(--accent-color)' }"></div>
            </div>
          </div>
          <div class="track-row">
            <span class="track-label">{{ prevMonthName }}</span>
            <div class="progress-track flex-1">
              <div class="progress-fill" :style="{ width: incomePrevPct + '%', backgroundColor: 'rgba(var(--divider-color))' }"></div>
            </div>
          </div>
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

const maxTasks = computed(() => Math.max(props.data.thisMonth.count, props.data.lastMonth.count) || 1);
const maxIncome = computed(() => Math.max(props.data.thisMonth.income, props.data.lastMonth.income) || 1);

const tasksPct = computed(() => Math.round((props.data.thisMonth.count / maxTasks.value) * 100));
const tasksPrevPct = computed(() => Math.round((props.data.lastMonth.count / maxTasks.value) * 100));
const incomePct = computed(() => Math.round((props.data.thisMonth.income / maxIncome.value) * 100));
const incomePrevPct = computed(() => Math.round((props.data.lastMonth.income / maxIncome.value) * 100));

const tasksDelta = computed(() => props.data.thisMonth.count - props.data.lastMonth.count);
const incomeDelta = computed(() => props.data.thisMonth.income - props.data.lastMonth.income);
</script>

<style scoped>
.comp-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.45;
  margin-bottom: 0.4rem;
}
.comp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.comp-values {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}
.comp-current {
  font-size: 1.1rem;
  font-weight: 700;
}
.comp-sep {
  font-size: 0.65rem;
  opacity: 0.4;
}
.comp-prev {
  font-size: 0.875rem;
  opacity: 0.5;
}
.delta-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}
.delta-chip.positive {
  background-color: rgba(80, 200, 120, 0.12);
  color: var(--primary-color);
}
.delta-chip.negative {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.comp-tracks {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.track-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.track-label {
  font-size: 0.6rem;
  opacity: 0.45;
  width: 2.2rem;
  flex-shrink: 0;
  text-align: right;
}
.progress-track {
  height: 5px;
  border-radius: 3px;
  background-color: rgba(var(--divider-color));
}
.progress-fill {
  height: 5px;
  border-radius: 3px;
  transition: width 0.5s ease;
  min-width: 2px;
}
</style>
