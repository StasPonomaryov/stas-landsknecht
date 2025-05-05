<template>
  <h1>Edit task {{ parsedId ? `#${parsedId}` : '' }}</h1>
  <ClientOnly>
    <section v-if="user" class="tasks edit">
      <div v-if="isLoading" class="flex justify-center">
        <UProgress animation="swing" />
      </div>
      <div v-else-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>
      <!-- Форма редагування завдання -->
      <UForm v-else-if="parsedId" :state="formData" @submit="onSubmit" :schema="editTaskFormSchema">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex flex-col gap-2 lg:w-1/3">
            <div class="flex flex-col gap-2">
              <UFormField label="Client" name="client" size="lg" required>
                <UInputMenu class="w-full" v-model="formData.client" :items="clients" value-key="value"
                  :error="formErrors.client" />
              </UFormField>
            </div>
            <div class="flex gap-2">
              <UFormField class="lg:w-1/2" label="Date start" name="dateStart" size="lg" required>
                <UInput class="w-full" v-model="formData.dateStart" :error="formErrors.dateStart" type="date" />
              </UFormField>
              <UFormField class="lg:w-1/2" label="Date end" name="dateEnd" size="lg">
                <UInput class="w-full" v-model="formData.dateEnd" :error="formErrors.dateEnd" type="date" />
              </UFormField>
            </div>
            <div class="flex gap-2">
              <div class="flex lg:w-1/2 flex-col">
                <UFormField label="Price start" name="priceStart" size="lg">
                  <UInputNumber class="w-full" v-model="formData.priceStart" :error="formErrors.priceStart"
                    orientation="vertical" />
                </UFormField>
                <UFormField label="Price end" name="priceEnd" size="lg">
                  <UInputNumber class="w-full" v-model="formData.priceEnd" :error="formErrors.priceEnd"
                    orientation="vertical" />
                </UFormField>
                <UFormField label="Hours spent" name="hours" size="lg">
                  <UInputNumber class="w-full" v-model="formData.hours" :error="formErrors.hours"
                    orientation="vertical" />
                </UFormField>
              </div>
              <div class="flex w-1/2 flex-col">
                <UFormField label="Task status" name="status" size="lg">
                  <URadioGroup v-model="formData.status" :items="statuses" :error="formErrors.status" />
                </UFormField>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 lg:w-2/3">
            <UFormField label="Title" name="title" size="lg" required>
              <UInput class="w-full" v-model="formData.title" :error="formErrors.title" />
            </UFormField>
            <UFormField label="Description" name="description" size="lg" class="h-full">
              <Editor v-model:content="formData.description" />
            </UFormField>
          </div>
        </div>
        <UButton class="mt-3" color="primary" type="submit">📝 Edit task</UButton>
      </UForm>
      <!-- Форма вибору завдання -->
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
    </section>
    <div v-else class="text-red-500">
      Please log in to edit tasks.
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAsyncData } from 'nuxt/app';
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { useAuthStore } from '~/stores/auth';
import { editTaskFormSchema, type EditTaskFormData, type EditTaskFormErrors } from '~/shared/utils/validators';
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui';
import { STATUSES, type Task } from '~/types';
import { convertStatusToText } from '~/shared/utils';

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();
const router = useRouter();
const route = useRoute();
const user = computed(() => {
  // console.log('User computed, SSR:', process.server, 'User:', authStore.user);
  return authStore.user;
});
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

const initialFormData: EditTaskFormData = {
  client: '',
  dateStart: new Date().toISOString().split('T')[0],
  description: '-',
  hours: 0,
  priceEnd: 0,
  priceStart: 0,
  status: 'processing',
  title: '',
};

const selectedTask = ref<{ label: string; value: string }>({ label: '', value: '' });
const formData = ref<EditTaskFormData>({ ...initialFormData });
const formErrors = ref<EditTaskFormErrors>({});
const statuses = ref<RadioGroupItem[]>(STATUSES);

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

const parsedId = computed(() => {
  const id = route.query.id;
  console.log('Parsed ID, SSR:', process.server, 'ID:', id);
  return id ? id.toString() : null;
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

const validateFormData = (): boolean => {
  const result = editTaskFormSchema.safeParse(formData.value);
  if (!result.success) {
    formErrors.value = result.error.errors.reduce((acc: EditTaskFormErrors, error) => {
      acc[error.path[0] as keyof EditTaskFormData] = error.message;
      return acc;
    }, {});
    return false;
  }
  formErrors.value = {};
  return true;
};

const onSubmit = (event: FormSubmitEvent<unknown>) => {
  errorMessage.value = null;
  if (!validateFormData()) {
    errorMessage.value = 'Please fix the form errors.';
    return;
  }
  console.log('Form submitted:', event);
};

const onTaskSelect = (value: string) => {
  console.log('Task selected via @update:modelValue:', value);
  selectedTask.value = {
    label: tasksStore.tasks.find((task) => task.id === value)?.title || '',
    value,
  };
  updateFormData(value);
};

const updateFormData = (taskId: string) => {
  console.log('Updating form data for task:', taskId);
  const task = tasksStore.tasks.find((t) => t.id === taskId);
  if (!task) {
    errorMessage.value = 'Task not found.';
    return;
  }

  formData.value = {
    client: task.clientId,
    dateStart: task.start,
    dateEnd: task.end,
    description: task.text,
    hours: task.hours ? Number(task.hours) : 0,
    priceStart: task.priceStart ? Number(task.priceStart) : 0,
    priceEnd: task.priceEnd ? Number(task.priceEnd) : 0,
    status: convertStatusToText(task.status),
    title: task.title,
  };

  router.replace({ query: { id: task.id } });
  console.log('Form data updated:', formData.value);
};

watch(
  () => selectedTask.value.value,
  (newValue) => {
    console.log('Watch triggered, selectedTask.value:', newValue);
    if (newValue) {
      updateFormData(newValue);
    }
  },
  { immediate: false }
);

watch(
  [() => parsedId.value, () => tasksStore.tasks],
  ([id, tasks]) => {
    if (!id) {
      // Якщо ID не вказано, очищаємо formData і selectedTask
      formData.value = { ...initialFormData };
      selectedTask.value = { label: '', value: '' };
      return;
    }

    if (!tasks.length) {
      errorMessage.value = 'No tasks available.';
      return;
    }

    const task = tasks.find((t) => t.id === id.toString());
    if (!task) {
      errorMessage.value = 'Task not found.';
      return;
    }

    formData.value = {
      client: task.clientId,
      dateStart: task.start,
      dateEnd: task.end,
      description: task.text,
      hours: task.hours ? Number(task.hours) : 0,
      priceStart: task.priceStart ? Number(task.priceStart) : 0,
      priceEnd: task.priceEnd ? Number(task.priceEnd) : 0,
      status: convertStatusToText(task.status),
      title: task.title,
    };

    selectedTask.value = {
      label: task.title,
      value: task.id,
    };
  },
  { immediate: true }
);
</script>