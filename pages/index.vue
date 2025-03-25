<template>
  <section>
    <div class="text-center">
      <h2>Analytics</h2>
      <div>All tasks: {{ tasksStore.tasks.length }}; this year: {{ thisYearTasks.length }}</div>
    </div>
    <div class="row">
      <div class="col">
        Choose year:
        <QuickSelect :options="allYears" :defaultOption="targetYear" @update="onUpdateOption" />
      </div>
      <div class="col">
        <b>This year income:</b>
        <span class="big">{{ thisYearIncome.toFixed(2) }}</span>
        ({{ lastYearIncome < thisYearIncome ? `+${(thisYearIncome - lastYearIncome).toFixed(2)}` : `${(thisYearIncome - lastYearIncome).toFixed(2)}`}})
      </div>
    </div>
    <div class="grid cards">
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
import type { Task, TasksChart } from '~/types';
const user = useCurrentUser();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();
const targetYear = ref(new Date().getFullYear());
const allYears = ref([2023, 2024, 2025]);
const thisYearTasks = ref<Task[]>([]);
const lastPeriodTasks = ref<Task[]>([]);
const tasksByCount = ref<TasksChart[]>([]);
const tasksByIncome = ref<TasksChart[]>([]);
const clientsByCount = ref<TasksChart[]>([]);
const clientsByIncome = ref<TasksChart[]>([]);

tasksStore.fetchUserTasks(user.value?.uid);
clientsStore.fetchUserClients(user.value?.uid);

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

loadTasksOfYear(targetYear.value);

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
  loadTasksOfYear(newYear);
});

watch(thisYearTasks, (newTasks) => {
  getTasksStats(newTasks, lastPeriodTasks.value, targetYear.value);
});

function onUpdateOption(value: number) {
  targetYear.value = value;
}
</script>
<style scoped></style>