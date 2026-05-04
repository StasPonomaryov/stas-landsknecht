<template>
  <div class="card">
    <h3>Needs attention</h3>
    <div v-if="!hasIssues" class="text-sm opacity-50">Everything looks good!</div>
    <div v-else class="flex flex-col gap-4">
      <div v-if="data.overdue.length">
        <div class="section-title">Overdue ({{ data.overdue.length }})</div>
        <ul class="issue-list">
          <li v-for="task in data.overdue.slice(0, 3)" :key="task.id">
            <NuxtLink to="/tasks" class="issue-link">{{ task.title }}</NuxtLink>
            <span class="issue-meta">{{ task.end }}</span>
          </li>
          <li v-if="data.overdue.length > 3" class="issue-more">+{{ data.overdue.length - 3 }} more</li>
        </ul>
      </div>
      <div v-if="data.unpaidDone.length">
        <div class="section-title">Unpaid done ({{ data.unpaidDone.length }})</div>
        <ul class="issue-list">
          <li v-for="task in data.unpaidDone.slice(0, 3)" :key="task.id">
            <NuxtLink to="/tasks" class="issue-link">{{ task.title }}</NuxtLink>
          </li>
          <li v-if="data.unpaidDone.length > 3" class="issue-more">+{{ data.unpaidDone.length - 3 }} more</li>
        </ul>
      </div>
      <div v-if="data.inactiveClients.length">
        <div class="section-title">No tasks this year ({{ data.inactiveClients.length }})</div>
        <ul class="issue-list">
          <li v-for="client in data.inactiveClients.slice(0, 3)" :key="client.id" class="text-sm">
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
.section-title {
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0.55;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.35rem;
}
.issue-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.issue-link {
  font-size: 0.875rem;
  color: var(--primary-color);
  text-decoration: none;
}
.issue-link:hover { text-decoration: underline; }
.issue-meta {
  font-size: 0.75rem;
  opacity: 0.45;
  margin-left: 0.5rem;
}
.issue-more {
  font-size: 0.75rem;
  opacity: 0.45;
}
</style>
