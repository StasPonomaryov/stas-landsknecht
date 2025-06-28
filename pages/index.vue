<template>
  <section>
    <div class="text-center">
      <h2>Analytics</h2>
      <div>All tasks: {{ tasks.length }}; this year: {{ thisYearTasks.length }}</div>
      <div class="flex gap-4 items-center justify-center my-4">
        <UInputMenu class="w-[100px]" v-model="targetYear"
          :items="allYears.map((y: string) => ({ value: y, label: y }))" value-key="value" />
        <div>
          <b>This year income:</b>
          <span class="big">{{ thisYearIncome.toFixed(2) }}</span>
          ({{ lastYearIncome < thisYearIncome ? `+${(thisYearIncome - lastYearIncome).toFixed(2)}` : `${(thisYearIncome
            - lastYearIncome).toFixed(2)}` }}) </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MonthlyOrdersChart :data="tasksByCount" />
        <MonthlyIncomeChart :data="tasksByIncome" />
        <ClientsChart :data="clientsByCount" title="Top clients by order count" />
        <ClientsChart :data="clientsByIncome" title="Top clients by income" />
      </div>
  </section>
</template>
<script setup lang="ts">
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { useAuthStore } from '~/stores/auth';
import { getTasksOfTheYear } from '~/composables/useAnalytics';
import ClientsChart from '~/components/app-ui/charts/ClientsChart.vue';
import MonthlyIncomeChart from '~/components/app-ui/charts/MonthlyIncomeChart.vue';
import MonthlyOrdersChart from '~/components/app-ui/charts/MonthlyOrdersChart.vue';
import type { Task, TasksChart } from '~/types';

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();

const user = computed(() => {
  return authStore.user;
});
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const targetYear = ref(new Date().getFullYear().toString());
const allYears = ref(['2023', '2024', '2025']);
const thisYearTasks = ref<Task[]>([]);
const lastPeriodTasks = ref<Task[]>([]);
const tasksByCount = ref<TasksChart[]>([]);
const tasksByIncome = ref<TasksChart[]>([]);
const clientsByCount = ref<TasksChart[]>([]);
const clientsByIncome = ref<TasksChart[]>([]);
const tasks = computed(() => {
  const taskList = tasksStore.tasks;
  console.log('Tasks computed, SSR:', process.server, 'Tasks:', taskList);
  return taskList;
});
const clients = computed(() => {
  const clientList = clientsStore.clients?.map((client) => ({ label: client.name, value: client.id })) || [];
  console.log('Clients computed, SSR:', process.server, 'Clients:', clientList);
  return clientList;
});

useAsyncData(
  'tasks-and-clients',
  async () => {
    if (!user.value || !user.value.uid) {
      errorMessage.value = 'User not authenticated.';
      isLoading.value = false;
      return;
    }

    try {
      await Promise.all([
        tasksStore.tasks.length ? Promise.resolve() : tasksStore.fetchUserTasks(user.value.uid),
        clientsStore.clients.length ? Promise.resolve() : clientsStore.fetchClients(),
      ]);
      errorMessage.value = null;
    } catch (error) {
      errorMessage.value = 'Failed to load data. Please try again.';
      console.error('Error in useAsyncData:', error);
    } finally {
      isLoading.value = false;
    }
  },
  { server: false, lazy: true }
);

async function loadTasksOfYear(year: number) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const thisYear = await getTasksOfTheYear(year);
  const lastYear = (tasksStore.tasks.values.length)
    ? dataTasksOfMonths(tasksStore.tasks, 1, currentMonth + 1)
    : await getTasksOfTheYear(year - 1)
  thisYearTasks.value = thisYear;
  lastPeriodTasks.value = lastYear;
}

function getTasksStats(yearTasks: Task[], lastPeriodTasks: Task[], targetYear: number) {
  const ordersCount = dataClientsOrdersCount(yearTasks);
  const ordersIncome = dataClientsOrdersIncome([...yearTasks, ...lastPeriodTasks], targetYear);
  const clientsOrdersCount = dataClientsByOrdersCount(yearTasks);
  const clientsOrdersIncome = dataClientsByOrdersIncome(yearTasks);
  tasksByCount.value = ordersCount;
  tasksByIncome.value = ordersIncome;
  clientsByCount.value = clientsOrdersCount;
  clientsByIncome.value = clientsOrdersIncome;
}

onMounted(() => loadTasksOfYear(Number(targetYear.value)));


const thisYearIncome = computed(() => {
  if (!tasksByIncome.value.length) return 0;

  return tasksByIncome.value.reduce((acc, item) => acc + item.count, 0);
});

const lastYearIncome = computed(() => {
  return lastPeriodTasks.value.reduce((acc, task) => {
    const prepayment = Number(task.priceStart) || 0;
    const postpayment = Number(task.priceEnd) || 0;
    return acc + prepayment + postpayment;
  }, 0);
});

watch(targetYear, (newYear) => {
  loadTasksOfYear(Number(newYear));
});

watch(thisYearTasks, (newTasks) => {
  getTasksStats(newTasks, lastPeriodTasks.value, Number(targetYear.value));
});
</script>
<style scoped></style>