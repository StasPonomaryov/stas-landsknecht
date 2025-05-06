<template>
  <h1>Remove task</h1>
  <ClientOnly>
    <section v-if="user" class="tasks edit">
      <div v-if="isLoading" class="flex justify-center">
        <UProgress animation="swing" />
      </div>
      <div v-else-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>
      <UForm v-else :state="selectedTask">

        <div v-if="tasks.length === 0" class="text-gray-500">
          No tasks available.
        </div>
        <div v-else class="flex flex-col lg:flex-row gap-4">
          <div class="flex flex-col gap-2 lg:w-1/3">
            <UFormField label="Task" name="task" size="lg" required>
              <UInputMenu class="w-full" v-model="selectedTask.value" :items="tasks" value-key="value"
                option-attribute="label" @update:modelValue="onTaskSelect" />
            </UFormField>
          </div>
        </div>
      </UForm>
      <div v-if="selectedTask.value && taskToRemove" class="flex flex-col gap-4 lg:w-1/3 mt-4">
        <div class="tasl-title">
          <h3>{{ taskToRemove.title }}</h3>
        </div>
        <div class="task-client">
          <b>Client:</b> {{ clientName }}
        </div>
        <div class="task-description">
          {{ taskToRemove.text }}
        </div>
        <div class="task-dates">
          <b>Task dates:</b> {{ taskToRemove.start }} - {{ taskToRemove.end }}
        </div>
        <div class="task-amount">
          <b>Task amount:</b> {{ taskToRemove.priceStart ?? 0 }} - {{ taskToRemove.priceEnd }}
        </div>
        <div class="task-hours">
          <b>Task hours:</b> {{ taskToRemove.hours }}
        </div>
        <div class="task-status">
          <b>Task status:</b> {{ convertStatusToText(taskToRemove.status) }}
        </div>
        <div class="task-actions">
          <UButton color="warning" @click="onRemoveTask">❌ Remove task</UButton>
        </div>
      </div>
      <div v-if="succeed">
        <div class="text-green-500">Task removed successfully!</div>
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
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { convertStatusToText } from '~/shared/utils';
import type { Task } from '~/types';

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const succeed = ref(false);
const selectedTask = ref<{ label: string; value: string }>({ label: '', value: '' });
const taskToRemove = ref<Task | null>(null);
const clientName = ref('');
const openModal = ref(false)

defineShortcuts({
  o: () => openModal.value = !openModal.value
})

const user = computed(() => {
  return authStore.user;
});
const tasks = computed(() => {
  const taskList = tasksStore.tasks?.map((task) => ({ label: task.title, value: task.id })) || [];
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
  title: 'Remove task - Landsknecht'
});
</script>

<style scoped></style>