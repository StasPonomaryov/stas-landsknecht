<script setup lang="ts">
import { addTaskFormSchema, type AddTaskFormData, type AddTaskFormErrors } from '~/shared/utils/validators';
import type { FormError, FormErrorEvent, FormSubmitEvent } from '@nuxt/ui';
import type { z } from 'zod';

const initialFormData: AddTaskFormData = {
  title: '',
};

const formData = ref<AddTaskFormData>({ ...initialFormData });
const formErrors = ref<AddTaskFormErrors>({});
const statusMessage = ref<string | null>(null);

function onSubmit(event: FormSubmitEvent<unknown>) {
  statusMessage.value = null;

  if (!validateFormData()) return;
  console.log(event);
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
</script>

<template>
  <div class="max-w-screen-sm mx-auto py-10">
    <UForm :state="formData" class="p-10 rounded-md space-y-3" @submit="onSubmit" :schema="addTaskFormSchema">
      <h1>Add task</h1>
      <UFormField label="Title" name="title" size="lg">
        <UInput v-model="formData.title" :error="formErrors.title" />
      </UFormField>
      <UButton class="mt-3" color="primary" type="submit">Add</UButton>
    </UForm>
  </div>
</template>

<style scoped></style>