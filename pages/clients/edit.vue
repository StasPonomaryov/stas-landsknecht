<template>
  <h1>Edit client {{ parsedId ? `#${parsedId}` : '' }}</h1>
  <ClientOnly>
    <section v-if="user" class="clients add">
      <div v-if="isLoading" class="flex justify-center">
        <UProgress animation="swing" />
      </div>
      <div v-else-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>
      <UForm v-else-if="parsedId" :state="formData" @submit="onSubmit" :schema="addClientFormSchema">
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
        <UButton class="mt-3" color="primary" type="submit">👨 Edit client</UButton>
      </UForm>
      <UForm v-else :state="selectedClient">
        <div v-if="clients.length === 0" class="text-gray-500">
          No tasks available.
        </div>
        <div v-else class="flex flex-col lg:flex-row gap-4">
          <div class="flex flex-col gap-2 lg:w-1/3">
            <UFormField label="Task" name="task" size="lg" required>
              <UInputMenu class="w-full" v-model="selectedClient.value" :items="clients" value-key="value"
                option-attribute="label" @update:modelValue="onClientSelect" />
            </UFormField>
          </div>
        </div>
      </UForm>
      <div class="mt-3" v-if="statusMessage">
        <UAlert :color="statusMessage.variant" :description="statusMessage.text" />
      </div>
    </section>
    <div v-else class="text-red-500">
      Please log in to edit tasks.
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">
import { addClientFormSchema, type AddClientFormData, type AddClientFormErrors } from '~/shared/utils/validators';
import type { FormSubmitEvent } from '@nuxt/ui';
import { type z } from 'zod';
import { useAuthStore } from '~/stores/auth';
import { useClientsStore } from '~/stores/clients';
import Editor from '~/components/editor.vue';
import { computed, ref, watch } from 'vue';
import { useAsyncData, useRoute, useRouter } from '#imports';

const authStore = useAuthStore();
const clientsStore = useClientsStore();
const router = useRouter();
const route = useRoute();
const user = computed(() => authStore.user);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const initialFormData: AddClientFormData = {
  contacts: '',
  description: '',
  name: '',
};

const formData = ref<AddClientFormData>({ ...initialFormData });
const formErrors = ref<AddClientFormErrors>({});
const statusMessage = ref<{ text: string, variant: "success" | "error" } | null>(null);
const selectedClient = ref<{ label: string; value: string }>({ label: '', value: '' });

const parsedId = computed(() => {
  const id = route.query.id;
  // console.log('Parsed ID, SSR:', process.server, 'ID:', id);
  if (id) isLoading.value = false;

  return id ? id.toString() : null;
});

const clients = computed(() => {
  const clientList = clientsStore.clients;
  // console.log('Clients computed, SSR:', process.server, 'Clients:', clientList);

  return clientList
});

useAsyncData(
  'clients',
  async () => {
    if (!user.value || !user.value.uid) {
      errorMessage.value = 'User not authenticated.';
      isLoading.value = false;
      return;
    }

    try {
      await Promise.all([
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

async function onSubmit(event: FormSubmitEvent<unknown>) {
  statusMessage.value = null;
  // console.log(event);

  if (!validateFormData() || !user.value) return;

  const clientId = parsedId.value ?? selectedClient.value.value;
  const data = {
    id: clientId,
    contacts: formData.value.contacts || '',
    description: formData.value.description || '',
    name: formData.value.name,
    users: [user.value.uid],
  };
  // console.log('Client, data:', clientId, data);

  try {
    await useClientsStore().updateClient(clientId, data);
    formData.value = { ...initialFormData };
    await useClientsStore().fetchUserClients(user.value.uid);
    setTimeout(() => {
      statusMessage.value = { text: 'Client edited successfully', variant: 'success' };
    }, 3000);
  } catch (error) {
    console.error(error);
    statusMessage.value = { text: 'Error editing client', variant: 'error' };
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
const onClientSelect = (value: string) => {
  // console.log('Client selected via @update:modelValue:', value);
  selectedClient.value = {
    label: clientsStore.clients.find((client) => client.id === value)?.name || '',
    value,
  };
  updateFormData(value);
};

const updateFormData = (clientId: string) => {
  // console.log('Updating form data for client:', clientId);
  const client = clientsStore.clients.find((t) => t.id === clientId);
  if (!client) {
    errorMessage.value = 'Client not found.';
    return;
  }

  formData.value = {
    contacts: client.contacts || '',
    description: client.description || '',
    name: client.name,
  };

  router.replace({ query: { id: client.id } });
  // console.log('Form data updated:', formData.value);
};

watch(
  () => selectedClient.value.value,
  (newValue) => {
    // console.log('Watch triggered, selectedClient.value:', newValue);
    if (newValue) {
      updateFormData(newValue);
    }
  },
  { immediate: false }
);

watch(
  [() => parsedId.value, () => clientsStore.clients],
  ([id, clients]) => {
    if (!id) {
      formData.value = { ...initialFormData };
      selectedClient.value = { label: '', value: '' };
      return;
    }

    if (!clients.length) {
      errorMessage.value = 'No clients available.';
      return;
    }

    const client = clients.find((t) => t.id === id.toString());
    if (!client) {
      errorMessage.value = 'Client not found.';
      return;
    }

    formData.value = {
      contacts: client.contacts || '',
      description: client.description || '',
      name: client.name,
    };

    selectedClient.value = {
      label: client.name,
      value: client.id,
    };
  },
  { immediate: true }
);
</script>
<style scoped></style>