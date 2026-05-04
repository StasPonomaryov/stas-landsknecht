<template>
  <div class="card">
    <h3>Task status</h3>
    <div v-if="data.total === 0" class="text-sm opacity-50">No tasks yet</div>
    <div v-else class="flex flex-col gap-3 mt-1">
      <div v-for="item in statuses" :key="item.label" class="status-item">
        <div class="status-meta">
          <div class="status-dot-label">
            <span class="status-dot" :style="{ backgroundColor: item.color }"></span>
            <span class="status-label">{{ item.label }}</span>
          </div>
          <div class="status-numbers">
            <span class="status-count">{{ item.count }}</span>
            <span class="status-pct">{{ item.pct }}%</span>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: item.pct + '%', backgroundColor: item.color }"></div>
        </div>
      </div>

      <div class="stacked-section">
        <div class="stacked-bar">
          <div v-for="item in statuses" :key="item.label"
            :style="{ width: item.pct + '%', backgroundColor: item.color }"
            :title="`${item.label}: ${item.count} (${item.pct}%)`">
          </div>
        </div>
        <div class="stacked-total">{{ data.total }} total</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    processing: number;
    done: number;
    cancelled: number;
    total: number;
  };
}>();

const statuses = computed(() => {
  const pct = (n: number) => props.data.total > 0 ? Math.round((n / props.data.total) * 100) : 0;
  return [
    { label: 'Processing', count: props.data.processing, pct: pct(props.data.processing), color: '#3b82f6' },
    { label: 'Done', count: props.data.done, pct: pct(props.data.done), color: '#50c878' },
    { label: 'Cancelled', count: props.data.cancelled, pct: pct(props.data.cancelled), color: '#ef4444' },
  ];
});
</script>

<style scoped>
.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.status-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-dot-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-label {
  font-size: 0.8rem;
}
.status-numbers {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}
.status-count {
  font-size: 0.875rem;
  font-weight: 700;
}
.status-pct {
  font-size: 0.65rem;
  opacity: 0.45;
  min-width: 2rem;
  text-align: right;
}
.progress-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(var(--divider-color));
}
.progress-fill {
  height: 4px;
  border-radius: 2px;
  transition: width 0.5s ease;
  min-width: 2px;
}
.stacked-section {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.stacked-bar {
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  gap: 1px;
}
.stacked-bar > div {
  transition: width 0.5s ease;
  min-width: 2px;
}
.stacked-total {
  font-size: 0.65rem;
  opacity: 0.4;
  text-align: right;
}
</style>
