<template>
  <h1>Edit task {{ parsedId ? `#${parsedId}` : '' }}</h1>
  <section v-if="user" class="tasks edit">
    <UForm :state="formData" @submit="onSubmit" :schema="editTaskFormSchema">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex flex-col gap-2 lg:w-1/3">
          <div class="flex flex-col gap-2">
            <UFormField label="Client" name="client" size="lg" required>
              <UInputMenu class="w-full" v-model="formData.client" :items="clients" value-key="value"
                :error="formErrors.client" />
            </UFormField>
          </div>
        </div>
      </div>
    </UForm>
  </section>
</template>
<script setup lang="ts">
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';
import { editTaskFormSchema, type EditTaskFormData, type EditTaskFormErrors } from '~/shared/utils/validators';
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui';
import type { z } from 'zod';
import { STATUSES } from '~/types';

const authStore = useAuthStore();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();
const user = computed(() => authStore.user);

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

const formData = ref<EditTaskFormData>({ ...initialFormData });
const formErrors = ref<EditTaskFormErrors>({});
const route = useRoute();
const { id } = route.query;
const parsedId = computed(() => {
  if (id) return parseInt(id as string);
  return null;
});
const statusMessage = ref<string | null>(null);
const statuses = ref<RadioGroupItem[]>(STATUSES);
const clients = computed(() => clientsStore.clients?.map((client) => ({ label: client.name, value: client.id })) || []);

const validateFormData = (): boolean => {
  const result: z.SafeParseReturnType<EditTaskFormData, EditTaskFormData> = editTaskFormSchema.safeParse(formData.value);

  if (!result.success) {
    formErrors.value = result.error.errors.reduce((acc: EditTaskFormErrors, error: any) => {
      const key = error.path[0] as keyof EditTaskFormData;
      acc[key] = error.message;
      return acc
    }, {} as EditTaskFormErrors)
    return false;
  }

  formErrors.value = {};
  return true;
};

function onSubmit(event: FormSubmitEvent<unknown>) {
  statusMessage.value = null;

  if (!validateFormData()) return;
  console.log(event);
}

if (user.value && !tasksStore.tasks.length) {
  tasksStore.fetchUserTasks(user.value.uid);
};
</script>

<style scoped></style>