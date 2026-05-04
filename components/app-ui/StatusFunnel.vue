<template>
  <div class="card">
    <h3>Task status</h3>
    <div v-if="data.total === 0" class="text-sm opacity-50">No tasks yet</div>
    <div v-else class="flex flex-col gap-4 mt-1">
      <div v-for="item in statuses" :key="item.label">
        <div class="funnel-row">
          <span class="funnel-dot" :style="{ backgroundColor: item.color }"></span>
          <span class="funnel-label">{{ item.label }}</span>
          <span class="funnel-count">{{ item.count }}</span>
          <span class="funnel-pct">{{ item.pct }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: item.pct + '%', backgroundColor: item.color }"></div>
        </div>
      </div>
      <div class="stacked-bar">
        <div v-for="item in statuses" :key="item.label"
          :style="{ width: item.pct + '%', backgroundColor: item.color }"
          :title="`${item.label}: ${item.count}`">
        </div>
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
.funnel-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
}
.funnel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.funnel-label { flex: 1; }
.funnel-count { font-weight: 700; }
.funnel-pct { font-size: 0.75rem; opacity: 0.5; min-width: 2.5rem; text-align: right; }
.progress-track { width: 100%; height: 4px; border-radius: 2px; background-color: rgba(var(--divider-color)); }
.progress-fill { height: 4px; border-radius: 2px; transition: width 0.4s ease; }
.stacked-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}
.stacked-bar > div { transition: width 0.4s ease; }
</style>
