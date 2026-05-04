<template>
  <section>
    <div class="page-header card mb-6">
      <div class="page-header-left">
        <div class="page-title-row">
          <h1 class="page-title">Dashboard</h1>
          <UInputMenu class="year-picker" v-model="targetYear"
            :items="allYears.map((y: string) => ({ value: y, label: y }))" value-key="value" />
        </div>
        <div class="page-stats-row">
          <div class="stat-chip">
            <span class="stat-chip-label">This year</span>
            <span class="stat-chip-value" style="color: var(--primary-color)">{{ thisYearIncome.toFixed(0) }}</span>
            <span class="stat-chip-delta" :class="thisYearIncome >= lastYearIncome ? 'positive' : 'negative'">
              {{ thisYearIncome >= lastYearIncome ? '↑' : '↓' }}
              {{ Math.abs(thisYearIncome - lastYearIncome).toFixed(0) }} vs prev year
            </span>
          </div>
          <div class="stat-chip">
            <span class="stat-chip-label">Tasks</span>
            <span class="stat-chip-value">{{ thisYearTasks.length }}</span>
          </div>
        </div>
      </div>
      <div class="page-header-actions">
        <NuxtLink to="/tasks/add" class="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Task
        </NuxtLink>
        <NuxtLink to="/clients/add" class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Client
        </NuxtLink>
      </div>
    </div>

    <KpiCards :data="kpiData" />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      <NeedsAttention :data="attentionData" />
      <MonthComparison :data="monthComparison" />
      <StatusFunnel :data="statusFunnel" />
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <MonthlyOrdersChart :data="tasksByCount" />
      <MonthlyIncomeChart :data="tasksByIncome" />
      <ClientsChart :data="clientsByCount" title="Top clients by count" />
      <ClientsChart :data="clientsByIncome" title="Top clients by income" />
    </div>

    <ActivityHeatmap :activity="activityHeatmap" :year="Number(targetYear)" class="mb-6" />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ProductiveDaysChart :data="productiveDays" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { useAuthStore } from '~/stores/auth';
import {
  dataClientsByOrdersCount,
  dataClientsByOrdersIncome,
  dataClientsOrdersCount,
  dataClientsOrdersIncome,
  dataTasksOfMonths,
  getTasksOfTheYear,
  computeKpiData,
  computeMonthComparison,
  computeStatusFunnel,
  computeActivityHeatmap,
  computeProductiveDays,
  computeNeedsAttention,
} from '~/composables/useAnalytics';
import ClientsChart from '~/components/app-ui/charts/ClientsChart.vue';
import MonthlyIncomeChart from '~/components/app-ui/charts/MonthlyIncomeChart.vue';
import MonthlyOrdersChart from '~/components/app-ui/charts/MonthlyOrdersChart.vue';
import ProductiveDaysChart from '~/components/app-ui/charts/ProductiveDaysChart.vue';
import KpiCards from '~/components/app-ui/KpiCards.vue';
import NeedsAttention from '~/components/app-ui/NeedsAttention.vue';
import MonthComparison from '~/components/app-ui/MonthComparison.vue';
import StatusFunnel from '~/components/app-ui/StatusFunnel.vue';
import ActivityHeatmap from '~/components/app-ui/ActivityHeatmap.vue';
import type { Task, TasksChart } from '~/types';
import { computed, onMounted, ref, watch } from 'vue';
import { useAsyncData } from '#imports';

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();

const user = computed(() => authStore.user);
const currentYear = new Date().getFullYear();
const targetYear = ref(currentYear.toString());
const allYears = ref(Array.from({ length: 4 }, (_, i) => (currentYear - 3 + i).toString()));

const thisYearTasks = ref<Task[]>([]);
const lastPeriodTasks = ref<Task[]>([]);
const tasksByCount = ref<TasksChart[]>([]);
const tasksByIncome = ref<TasksChart[]>([]);
const clientsByCount = ref<TasksChart[]>([]);
const clientsByIncome = ref<TasksChart[]>([]);

const kpiData = ref({ totalIncome: 0, activeTasks: 0, avgTaskValue: 0, completionRate: 0, pendingPaymentCount: 0 });
const attentionData = ref<{ overdue: Task[]; unpaidDone: Task[]; inactiveClients: { id: string; name: string; description: string; contacts: string; users: string[] }[] }>({
  overdue: [], unpaidDone: [], inactiveClients: [],
});
const monthComparison = ref({ thisMonth: { count: 0, income: 0 }, lastMonth: { count: 0, income: 0 } });
const statusFunnel = ref({ processing: 0, done: 0, cancelled: 0, total: 0 });
const activityHeatmap = ref<Record<string, number>>({});
const productiveDays = ref<{ day: string; count: number }[]>([]);

useAsyncData(
  'analytics-clients',
  async () => {
    if (!user.value?.uid) return;
    try {
      await Promise.all([
        clientsStore.clients.length ? Promise.resolve() : clientsStore.fetchUserClients(user.value.uid),
      ]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  },
  { server: false, lazy: true }
);

async function loadTasksOfYear(year: number) {
  const uid = user.value?.uid;
  if (!uid) {
    thisYearTasks.value = [];
    lastPeriodTasks.value = [];
    return;
  }

  const today = new Date();
  const currentMonth = today.getMonth();
  const thisYear = await getTasksOfTheYear(year, uid);
  const lastYear = tasksStore.tasks.length
    ? dataTasksOfMonths(
        tasksStore.tasks.filter(t => new Date(t.start).getFullYear() === year - 1),
        1,
        currentMonth + 1
      )
    : await getTasksOfTheYear(year - 1, uid);

  thisYearTasks.value = thisYear;
  lastPeriodTasks.value = lastYear;
}

function getTasksStats(yearTasks: Task[], prevTasks: Task[], year: number) {
  tasksByCount.value = dataClientsOrdersCount(yearTasks);
  tasksByIncome.value = dataClientsOrdersIncome([...yearTasks, ...prevTasks], year);
  clientsByCount.value = dataClientsByOrdersCount(yearTasks);
  clientsByIncome.value = dataClientsByOrdersIncome(yearTasks);

  kpiData.value = computeKpiData(yearTasks);
  monthComparison.value = computeMonthComparison(yearTasks, year);
  statusFunnel.value = computeStatusFunnel(yearTasks);
  activityHeatmap.value = computeActivityHeatmap(yearTasks);
  productiveDays.value = computeProductiveDays(yearTasks);
  attentionData.value = computeNeedsAttention(yearTasks, clientsStore.clients);
}

onMounted(() => loadTasksOfYear(Number(targetYear.value)));

const thisYearIncome = computed(() =>
  tasksByIncome.value.reduce((acc, item) => acc + item.count, 0)
);

const lastYearIncome = computed(() =>
  lastPeriodTasks.value.reduce((acc, task) => {
    return acc + (Number(task.priceStart) || 0) + (Number(task.priceEnd) || 0);
  }, 0)
);

watch(targetYear, (newYear) => loadTasksOfYear(Number(newYear)));

watch(thisYearTasks, (newTasks) => {
  getTasksStats(newTasks, lastPeriodTasks.value, Number(targetYear.value));
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.page-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.page-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}
.year-picker {
  width: 90px;
}
.page-stats-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.stat-chip {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}
.stat-chip-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  opacity: 0.45;
}
.stat-chip-value {
  font-size: 1.1rem;
  font-weight: 700;
}
.stat-chip-delta {
  font-size: 0.7rem;
  opacity: 0.6;
}
.stat-chip-delta.positive { color: var(--primary-color); opacity: 1; }
.stat-chip-delta.negative { color: #ef4444; opacity: 1; }
.page-header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}
</style>
