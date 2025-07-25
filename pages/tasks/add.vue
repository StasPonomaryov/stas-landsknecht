<template>
  <h1>Add task</h1>
  <section v-if="user" class="tasks add">
    <UForm :state="formData" @submit="onSubmit" :schema="addTaskFormSchema">
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
                  orientation="vertical" step="any" />
              </UFormField>
              <UFormField label="Price end" name="priceEnd" size="lg">
                <UInputNumber class="w-full" v-model="formData.priceEnd" :error="formErrors.priceEnd"
                  orientation="vertical" step="any" />
              </UFormField>
              <UFormField label="Hours spent" name="hours" size="lg">
                <UInputNumber class="w-full" v-model="formData.hours" :error="formErrors.hours"
                  orientation="vertical" step="0.25" />
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
            <!-- <UTextarea class="w-full" v-model="formData.description" autoresize :error="formErrors.description" /> -->
            <Editor v-model:content="formData.description" />
          </UFormField>
        </div>
      </div>
      <UButton class="mt-3" color="primary" type="submit">📝 Add task</UButton>
    </UForm>
    <div class="mt-3" v-if="statusMessage">
      <UAlert :color="statusMessage.variant" :description="statusMessage.text" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { nanoid } from 'nanoid';
import { addTaskFormSchema, type AddTaskFormData, type AddTaskFormErrors } from '~/shared/utils/validators';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { RadioGroupItem } from '@nuxt/ui'
import type { z } from 'zod';
import { useAuthStore } from '~/stores/auth';
import { useClientsStore } from '~/stores/clients';
import { STATUSES } from '~/types';
import Editor from '~/components/editor.vue';
import { convertStatusToNumber } from '~/shared/utils';
import { computed, ref } from 'vue';
import { useTasksStore } from '~/stores/tasks';

const authStore = useAuthStore();
const clientsStore = useClientsStore();
const user = computed(() => authStore.user);

const initialFormData: AddTaskFormData = {
  client: '',
  dateStart: new Date().toISOString().split('T')[0],
  description: '',
  hours: 0,
  priceEnd: 0,
  priceStart: 0,
  status: 'processing',
  title: '',
};

const formData = ref<AddTaskFormData>({ ...initialFormData });
const formErrors = ref<AddTaskFormErrors>({});
const statusMessage = ref<{ text: string, variant: "success" | "error" } | null>(null);
const statuses = ref<RadioGroupItem[]>(STATUSES);
const clients = computed(() => clientsStore.clients?.map((client) => ({ label: client.name, value: client.id })) || []);

async function onSubmit(event: FormSubmitEvent<unknown>) {
  statusMessage.value = null;

  if (!validateFormData() || !user.value) return;
  // console.log(event);

  const data = {
    clientId: formData.value.client,
    ...(formData.value.dateEnd && { end: formData.value.dateEnd }),
    hours: formData.value.hours || 0,
    id: nanoid(10),
    priceStart: formData.value.priceStart || 0,
    priceEnd: formData.value.priceEnd || 0,
    start: formData.value.dateStart,
    status: convertStatusToNumber(formData.value.status),
    text: formData.value.description,
    title: formData.value.title,
    users: [user.value.uid],
  };

  try {
    await useTasksStore().addTask(data);
    formData.value = { ...initialFormData };
    await useTasksStore().fetchUserTasks(user.value.uid);
    setTimeout(() => {
      statusMessage.value = { text: 'Task added successfully', variant: 'success' };
    }, 3000);
  } catch (error) {
    console.error(error);
    statusMessage.value = { text: 'Error adding task', variant: 'error' };
  }
}

const validateFormData = (): boolean => {
  const result: z.SafeParseReturnType<AddTaskFormData, AddTaskFormData> = addTaskFormSchema.safeParse(formData.value);

  if (!result.success) {
    formErrors.value = result.error.errors.reduce((acc: AddTaskFormErrors, error: any) => {
      const key = error.path[0] as keyof AddTaskFormData;
      acc[key] = error.message;
      return acc
    }, {} as AddTaskFormErrors)
    return false;
  }

  formErrors.value = {};
  return true;
};

if (user.value && !clientsStore.clients.length) {
  clientsStore.fetchUserClients(user.value.uid);
};
</script>
<style scoped></style>