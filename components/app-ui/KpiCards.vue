<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-6">
    <div class="card">
      <div class="kpi-label">Total income</div>
      <div class="kpi-value" style="color: var(--primary-color)">{{ data.totalIncome.toFixed(0) }}</div>
    </div>
    <div class="card">
      <div class="kpi-label">Active tasks</div>
      <div class="kpi-value">{{ data.activeTasks }}</div>
      <div class="kpi-sub">in progress</div>
    </div>
    <div class="card">
      <div class="kpi-label">Avg task value</div>
      <div class="kpi-value">{{ data.avgTaskValue.toFixed(0) }}</div>
    </div>
    <div class="card">
      <div class="kpi-label">Completion</div>
      <div class="kpi-value">{{ data.completionRate }}%</div>
      <div class="progress-track mt-2">
        <div class="progress-fill" :style="{ width: data.completionRate + '%' }"></div>
      </div>
    </div>
    <div class="card">
      <div class="kpi-label">Awaiting final pay</div>
      <div class="kpi-value" :style="{ color: data.pendingPaymentCount > 0 ? '#f97316' : 'inherit' }">
        {{ data.pendingPaymentCount }}
      </div>
      <div class="kpi-sub">done, no priceEnd</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: {
    totalIncome: number;
    activeTasks: number;
    avgTaskValue: number;
    completionRate: number;
    pendingPaymentCount: number;
  };
}>();
</script>

<style scoped>
.kpi-label { font-size: 0.75rem; opacity: 0.6; margin-bottom: 0.25rem; }
.kpi-value { font-size: 1.5rem; font-weight: bold; line-height: 1.2; }
.kpi-sub { font-size: 0.7rem; opacity: 0.5; margin-top: 0.25rem; }
.progress-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(var(--divider-color));
}
.progress-fill {
  height: 4px;
  border-radius: 2px;
  background-color: var(--primary-color);
  transition: width 0.4s ease;
}
</style>
