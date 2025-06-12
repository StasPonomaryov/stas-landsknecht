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
          <TasksTable :data="tasks" :columns="columns" @removeSelected="onRemoveTask" />
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
const tasksToRemove = ref<Task[] | null>(null);

defineShortcuts({
  o: () => openModal.value = !openModal.value
});

const tasks = computed(() => {
  const taskList = tasksStore.tasks;
  console.log('Tasks computed, SSR:', process.server, 'Tasks:', taskList);

  const tasksWithClients = taskList.map((task) => {
    const client = clientsStore.clients.find((client) => client.id === task.clientId);
    return { ...task, clientName: client?.name || '' };
  });

  return tasksWithClients;
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

const onRemoveTask = (taskIds: string[]) => {
  if (taskIds.length === 1) {
    const task = tasksStore.tasks.find(t => t.id === taskIds[0]);
    if (task) {
      selectedTask.value = {
        label: task.title,
        value: task.id
      };
      tasksToRemove.value = [task];
      openModal.value = true;
    }
  } else {
    selectedTask.value = {
      label: `${taskIds.length} tasks`,
      value: taskIds.join(', ')
    };
    tasksToRemove.value = tasksStore.tasks.filter((task) => taskIds.includes(task.id));
    openModal.value = true;
  }
};

const confirmRemoveTask = async () => {
  if (!tasksToRemove.value) {
    errorMessage.value = 'Task not selected.';
    return;
  }

  try {
    const success = await tasksStore.removeTask(tasksToRemove.value.map((task) => task.id));

    if (success) {
      // tasksStore.tasks = tasksStore.tasks.filter(task => task.id !== taskToRemove.value?.id);
      openModal.value = false;
      selectedTask.value = { label: '', value: '' };
      tasksToRemove.value = null;
      succeed.value = true;
      setTimeout(() => {
        succeed.value = false;
      }, 3000);
    }
  } catch (error) {
    errorMessage.value = 'Failed to remove task. Please try again.';
    console.error('Error in confirmRemoveTask:', error);
  }
};

onMounted(() => {
  if (tasksStore.tasks.length && clientsStore.clients.length) {
    isLoading.value = false;
  }
});

useHead({
  title: 'Tasks table - Landsknecht'
});
</script>

<style scoped></style>