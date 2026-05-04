<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-6">
    <div class="card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">Total income</span>
        <svg class="kpi-icon" style="color: var(--primary-color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <div class="kpi-value" style="color: var(--primary-color)">{{ data.totalIncome.toFixed(0) }}</div>
      <div class="kpi-sub">all time</div>
    </div>

    <div class="card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">Active tasks</span>
        <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div class="kpi-value">{{ data.activeTasks }}</div>
      <div class="kpi-sub">in progress</div>
    </div>

    <div class="card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">Avg task value</span>
        <svg class="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      </div>
      <div class="kpi-value">{{ data.avgTaskValue.toFixed(0) }}</div>
      <div class="kpi-sub">per task</div>
    </div>

    <div class="card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">Completion</span>
        <svg class="kpi-icon" style="color: var(--primary-color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <div class="kpi-value">{{ data.completionRate }}<span class="kpi-unit">%</span></div>
      <div class="progress-track mt-2">
        <div class="progress-fill" :style="{ width: data.completionRate + '%' }"></div>
      </div>
    </div>

    <div class="card kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">Awaiting pay</span>
        <svg class="kpi-icon" :style="{ color: data.pendingPaymentCount > 0 ? '#f97316' : 'currentColor' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="kpi-value" :style="{ color: data.pendingPaymentCount > 0 ? '#f97316' : 'inherit' }">
        {{ data.pendingPaymentCount }}
      </div>
      <div class="kpi-sub">done, unpaid</div>
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
.kpi-card {
  display: flex;
  flex-direction: column;
}
.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.kpi-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.5;
}
.kpi-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  flex-shrink: 0;
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
}
.kpi-unit {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.7;
}
.kpi-sub {
  font-size: 0.65rem;
  opacity: 0.45;
  margin-top: 0.2rem;
}
.progress-track {
  width: 100%;
  height: 3px;
  border-radius: 2px;
  background-color: rgba(var(--divider-color));
}
.progress-fill {
  height: 3px;
  border-radius: 2px;
  background-color: var(--primary-color);
  transition: width 0.5s ease;
}
</style>
