<template>
  <section>
    <h2>Clients<span class="badge">{{ clients.length }}</span></h2>
    <div class="container py-10 mx-auto">
      <DataTable :columns="columns" :data="clients" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { columns } from './columns';
const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const user = useCurrentUser();

if (!clients?.value?.length) {
  clientsStore.fetchUserClients(user.value?.uid);
}

useHead({
  title: 'Clients table - Landsknecht'
});
</script>

<style scoped></style>