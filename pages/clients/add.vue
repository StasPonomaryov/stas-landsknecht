<template>
  <h1>Add client</h1>
  <section v-if="user" class="clients add">
    <UForm :state="formData" @submit="onSubmit" :schema="addClientFormSchema">
      <div class="flex flex-col lg:flex-row gap-4">
        <div class="flex flex-col gap-2 lg:w-1/3">
          <UFormField label="Name" name="name" size="lg" required>
            <UInput class="w-full" v-model="formData.name" :error="formErrors.name" />
          </UFormField>
          <UFormField label="Contacts" name="contacts" size="lg" required>
            <UInput class="w-full" v-model="formData.contacts" :error="formErrors.contacts" />
          </UFormField>
          <UFormField label="Description" name="description" size="lg" class="h-full">
            <Editor v-model:content="formData.description" />
          </UFormField>
        </div>
      </div>
      <UButton class="mt-3" color="primary" type="submit">👨 Add client</UButton>
    </UForm>
    <div class="mt-3" v-if="statusMessage">
      <UAlert :color="statusMessage.variant" :description="statusMessage.text" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { nanoid } from 'nanoid';
import { addClientFormSchema, type AddClientFormData, type AddClientFormErrors } from '~/shared/utils/validators';
import type { FormSubmitEvent } from '@nuxt/ui';
import { type z } from 'zod';
import { useAuthStore } from '~/stores/auth';
import { useClientsStore } from '~/stores/clients';
import Editor from '~/components/editor.vue';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const clientsStore = useClientsStore();
const user = computed(() => authStore.user);

const initialFormData: AddClientFormData = {
  contacts: '',
  description: '',
  name: '',
};

const formData = ref<AddClientFormData>({ ...initialFormData });
const formErrors = ref<AddClientFormErrors>({});
const statusMessage = ref<{ text: string, variant: "success" | "error" } | null>(null);

async function onSubmit(event: FormSubmitEvent<unknown>) {
  statusMessage.value = null;
  // console.log(event);

  if (!validateFormData() || !user.value) return;

  const data = {
    id: nanoid(8),
    contacts: formData.value.contacts || '',
    description: formData.value.description || '',
    name: formData.value.name,
    users: [user.value.uid],
  };

  try {
    await useClientsStore().addClient(data);
    formData.value = { ...initialFormData };
    await useClientsStore().fetchUserClients(user.value.uid);
    setTimeout(() => {
      statusMessage.value = { text: 'Client added successfully', variant: 'success' };
    }, 3000);
  } catch (error) {
    console.error(error);
    statusMessage.value = { text: 'Error adding client', variant: 'error' };
  }
}

const validateFormData = (): boolean => {
  const result: z.SafeParseReturnType<AddClientFormData, AddClientFormData> = addClientFormSchema.safeParse(formData.value);

  if (!result.success) {
    formErrors.value = result.error.errors.reduce((acc: AddClientFormErrors, error: any) => {
      const key = error.path[0] as keyof AddClientFormData;
      acc[key] = error.message;
      return acc
    }, {} as AddClientFormErrors)
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