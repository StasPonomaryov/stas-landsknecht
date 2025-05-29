<template>
  <h1>Tasks<span class="badge">{{ tasks.length }}</span></h1>
  <section>
    <div v-if="isLoading" class="flex justify-center">
      <UProgress animation="swing" />
    </div>
    <div v-else-if="errorMessage" class="text-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="user" class="tasks">
      <div class="w-full py-5 mx-auto" v-if="tasks.length">
        <ClientOnly>
          <TasksTable :data="tasks" :columns="columns" />
        </ClientOnly>
      </div>
      <div v-else class="">Waiting for data...</div>
    </div>
  </section>
  <UModal v-model:open="openModal">
    <template #header>
      <h3>Removing task</h3>
    </template>
    <template #body>Do you really want to remove task <b>{{ selectedTask.value }}</b> from database?</template>
    <template #footer class="justify-end">
      <div class="flex gap-2">
        <UButton color="neutral" label="Dismiss" @click="openModal = false" />
        <UButton color="error" label="Confirm" @click="confirmRemoveTask" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useAsyncData } from 'nuxt/app';
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { useAuthStore } from '~/stores/auth';
import type { Task } from '~/types';
import { columns } from '~/components/tasks/columns';
const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();

const user = computed(() => {
  return authStore.user;
});
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const openModal = ref(false);
const succeed = ref(false);
const selectedTask = ref<{ label: string; value: string }>({ label: '', value: '' });
const taskToRemove = ref<Task | null>(null);
const clientName = ref('');

defineShortcuts({
  o: () => openModal.value = !openModal.value
});

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
    } catch (error) {
      errorMessage.value = 'Failed to load data. Please try again.';
      console.error('Error in useAsyncData:', error);
    } finally {
      isLoading.value = false;
    }
  },
  { server: false, lazy: true }
);

const onTaskSelect = (value: string) => {
  console.log('Task selected via @update:modelValue:', value);
  selectedTask.value = {
    label: tasksStore.tasks.find((task) => task.id === value)?.title || '',
    value,
  };
  taskToRemove.value = tasksStore.tasks.find((task) => task.id === value) || null;

  if (taskToRemove.value?.clientId) {
    const client = clients.value.find((client) => client.value === taskToRemove.value?.clientId);
    if (client) {
      clientName.value = client.label;
    }
  }
};

const onRemoveTask = async () => {
  if (!taskToRemove.value) {
    errorMessage.value = 'Task not selected.';
    return;
  }

  openModal.value = true;
};

const confirmRemoveTask = async () => {
  if (!taskToRemove.value) {
    errorMessage.value = 'Task not selected.';
    return;
  }

  try {
    openModal.value = false;
    await tasksStore.removeTask(taskToRemove.value.id);
    selectedTask.value = { label: '', value: '' };
    taskToRemove.value = null;
    succeed.value = true;
    setTimeout(() => {
      succeed.value = false;
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to remove task. Please try again.';
    console.error('Error in confirmRemoveTask:', error);
  }
};

useHead({
  title: 'Tasks table - Landsknecht'
});
</script>

<style scoped></style>