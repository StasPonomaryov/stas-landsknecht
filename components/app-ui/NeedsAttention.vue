<template>
  <div class="card">
    <h3>Needs attention</h3>
    <div v-if="!hasIssues" class="empty-state">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>Everything looks good!</span>
    </div>
    <div v-else class="flex flex-col gap-4">
      <div v-if="data.overdue.length">
        <div class="section-title">
          <span class="badge badge-error">{{ data.overdue.length }}</span>
          Overdue
        </div>
        <ul class="issue-list">
          <li v-for="task in data.overdue.slice(0, 3)" :key="task.id" class="issue-item">
            <NuxtLink to="/tasks" class="issue-link">{{ task.title }}</NuxtLink>
            <span class="issue-meta">{{ task.end }}</span>
          </li>
          <li v-if="data.overdue.length > 3" class="issue-more">+{{ data.overdue.length - 3 }} more</li>
        </ul>
      </div>
      <div v-if="data.unpaidDone.length">
        <div class="section-title">
          <span class="badge badge-warn">{{ data.unpaidDone.length }}</span>
          Unpaid done
        </div>
        <ul class="issue-list">
          <li v-for="task in data.unpaidDone.slice(0, 3)" :key="task.id" class="issue-item">
            <NuxtLink to="/tasks" class="issue-link">{{ task.title }}</NuxtLink>
          </li>
          <li v-if="data.unpaidDone.length > 3" class="issue-more">+{{ data.unpaidDone.length - 3 }} more</li>
        </ul>
      </div>
      <div v-if="data.inactiveClients.length">
        <div class="section-title">
          <span class="badge badge-muted">{{ data.inactiveClients.length }}</span>
          No tasks this year
        </div>
        <ul class="issue-list">
          <li v-for="client in data.inactiveClients.slice(0, 3)" :key="client.id" class="issue-item text-sm">
            {{ client.name }}
          </li>
          <li v-if="data.inactiveClients.length > 3" class="issue-more">+{{ data.inactiveClients.length - 3 }} more</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task, Client } from '~/types';

const props = defineProps<{
  data: {
    overdue: Task[];
    unpaidDone: Task[];
    inactiveClients: Client[];
  };
}>();

const hasIssues = computed(() =>
  props.data.overdue.length > 0 || props.data.unpaidDone.length > 0 || props.data.inactiveClients.length > 0
);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0;
  font-size: 0.8rem;
  opacity: 0.5;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
  margin-bottom: 0.4rem;
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0;
  opacity: 1;
}
.badge-error {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}
.badge-warn {
  background-color: rgba(249, 115, 22, 0.15);
  color: #f97316;
}
.badge-muted {
  background-color: rgba(var(--divider-color));
  color: var(--main-text-color);
  opacity: 0.7;
}
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.issue-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}
.issue-link {
  font-size: 0.8rem;
  color: var(--primary-color);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.issue-link:hover { text-decoration: underline; }
.issue-meta {
  font-size: 0.7rem;
  opacity: 0.4;
  flex-shrink: 0;
}
.issue-more {
  font-size: 0.7rem;
  opacity: 0.4;
}
</style>
