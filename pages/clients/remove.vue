<template>
  <h1>Remove client</h1>
  <ClientOnly>
    <section v-if="user" class="clients edit">
      <div v-if="isLoading" class="flex justify-center">
        <UProgress animation="swing" />
      </div>
      <div v-else-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>
      <UForm v-else :state="selectedClient">
        <div v-if="clients.length === 0" class="text-gray-500">
          No clients available.
        </div>
        <div v-else class="flex flex-col lg:flex-row gap-4">
          <div class="flex flex-col gap-2 lg:w-1/3">
            <UFormField label="Client" name="client" size="lg" required>
              <UInputMenu class="w-full" v-model="selectedClient.value" :items="clients" value-key="value"
                option-attribute="label" @update:modelValue="onClientSelect" />
            </UFormField>
          </div>
        </div>
      </UForm>
      <div v-if="selectedClient.value && clientToRemove" class="flex flex-col gap-4 lg:w-1/3 mt-4">
        <div class="client-name">
          <h3>{{ clientToRemove.name }}</h3>
        </div>
        <div class="client-description">
          {{ clientToRemove.description }}
        </div>
        <div class="client-contacts">
          <b>Client contacts:</b> {{ clientToRemove.contacts }}
        </div>
        <div class="client-actions">
          <UButton color="warning" @click="onRemoveClient">❌ Remove client</UButton>
        </div>
      </div>
      <div v-if="succeed">
        <div class="text-green-500">Client removed successfully!</div>
      </div>
    </section>
    <UModal v-model:open="openModal">
      <template #header>
        <h3>Removing client</h3>
      </template>
      <template #body>Do you really want to remove client <b>{{ selectedClient.value }}</b> from database?</template>
      <template #footer class="justify-end">
        <div class="flex gap-2">
          <UButton color="neutral" label="Dismiss" @click="openModal = false" />
          <UButton color="error" label="Confirm" @click="confirmRemoveClient" />
        </div>
      </template>
    </UModal>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useClientsStore } from '~/stores/clients';
import type { Client } from '~/types';
import { computed, defineShortcuts, ref, useAsyncData, useHead } from '#imports';

const authStore = useAuthStore();
const clientsStore = useClientsStore();
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const succeed = ref(false);
const selectedClient = ref<{ label: string; value: string }>({ label: '', value: '' });
const clientToRemove = ref<Client | null>(null);
const clientName = ref('');
const openModal = ref(false)

defineShortcuts({
  o: () => openModal.value = !openModal.value
})

const user = computed(() => {
  return authStore.user;
});
const clients = computed(() => {
  const clientList = clientsStore.clients?.map((client) => ({ label: client.name, value: client.id })) || [];
  // console.log('Clients computed, SSR:', process.server, 'Clients:', clientList);
  return clientList;
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

const onClientSelect = (value: string) => {
  // console.log('Client selected via @update:modelValue:', value);
  selectedClient.value = {
    label: clientsStore.clients.find((client) => client.id === value)?.name || '',
    value,
  };
  clientToRemove.value = clientsStore.clients.find((client) => client.id === value) || null;

  if (clientToRemove.value?.id) {
    const client = clients.value.find((client) => client.value === clientToRemove.value?.id);
    if (client) {
      clientName.value = client.label;
    }
  }
};

const onRemoveClient = async () => {
  if (!clientToRemove.value) {
    errorMessage.value = 'Client not selected.';
    return;
  }

  openModal.value = true;
};

const confirmRemoveClient = async () => {
  if (!clientToRemove.value) {
    errorMessage.value = 'Client not selected.';
    return;
  }

  try {
    openModal.value = false;
    await clientsStore.removeClient([clientToRemove.value.id]);
    selectedClient.value = { label: '', value: '' };
    clientToRemove.value = null;
    succeed.value = true;
    setTimeout(() => {
      succeed.value = false;
    }, 3000);
  } catch (error) {
    errorMessage.value = 'Failed to remove client. Please try again.';
    console.error('Error in confirmRemoveClient:', error);
  }
};

useHead({
  title: 'Remove client - Landsknecht'
});
</script>

<style scoped></style>