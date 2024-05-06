<template>
  <section v-if="user" class="customers">
    <h2>Customers table</h2>

    <div class="container py-10 mx-auto">
      <DataTable :columns="columns" :data="customers" />
    </div>

  </section>
</template>

<script setup>
import { columns } from './columns';
const user = useSupabaseUser();
const customersStore = useCustomersStore();
const { customers } = storeToRefs(customersStore);

useHead({
  title: 'Customers table - Landsknecht'
});
</script>

<style scoped></style>