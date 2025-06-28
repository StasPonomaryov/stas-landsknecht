<template>
  <h1>Clients<span class="badge">{{ clients.length }}</span></h1>
  <section>
    <div v-if="isLoading" class="flex justify-center">
      <UProgress animation="swing" />
    </div>
    <div v-else-if="errorMessage" class="text-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="user" class="clients">
      <div class="w-full py-5 mx-auto" v-if="clients.length">
        <ClientOnly>
          <ClientsTable :data="clients" :columns="columns" @removeSelected="onRemoveClient" />
        </ClientOnly>
      </div>
      <div v-else class="">Waiting for data...</div>
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAsyncData, useHead } from '#imports';
import { useClientsStore } from '~/stores/clients';
import { useAuthStore } from '~/stores/auth';
import ClientsTable from '~/components/clients/clients-table.vue';
import { columns } from '~/components/clients/columns';
import type { Client } from '~/types';
const authStore = useAuthStore();
const clientsStore = useClientsStore();

const user = computed(() => {
  return authStore.user;
});
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const openModal = ref(false);
const succeed = ref(false);
const selectedClient = ref<{ label: string; value: string }>({ label: '', value: '' });
const clientsToRemove = ref<Client[] | null>(null);

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

const onRemoveClient = (clientIds: string[]) => {
  if (clientIds.length === 1) {
    const client = clientsStore.clients.find(t => t.id === clientIds[0]);
    if (client) {
      selectedClient.value = {
        label: client.name,
        value: client.id
      };
      clientsToRemove.value = [client];
      openModal.value = true;
    }
  } else {
    selectedClient.value = {
      label: `${clientIds.length} clients`,
      value: clientIds.join(', ')
    };
    clientsToRemove.value = clientsStore.clients.filter((client) => clientIds.includes(client.id));
    openModal.value = true;
  }
};

const confirmRemoveClient = async () => {
  if (!clientsToRemove.value) {
    errorMessage.value = 'Client not selected.';
    return;
  }

  try {
    const success = await clientsStore.removeClient(clientsToRemove.value.map((task) => task.id));

    if (success) {
      // clientsStore.clients = clientsStore.clients.filter(task => task.id !== taskToRemove.value?.id);
      openModal.value = false;
      selectedClient.value = { label: '', value: '' };
      clientsToRemove.value = null;
      succeed.value = true;
      setTimeout(() => {
        succeed.value = false;
      }, 3000);
    }
  } catch (error) {
    errorMessage.value = 'Failed to remove task. Please try again.';
    console.error('Error in confirmRemoveClient:', error);
  }
};

onMounted(() => {
  if (clientsStore.clients.length) {
    isLoading.value = false;
  }
});

useHead({
  title: 'Clients table - Landsknecht'
});
</script>