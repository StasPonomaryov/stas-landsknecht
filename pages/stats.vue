<template>
  <section class="stats">
    <h2>Statistics</h2>
    <div class="grid cards">
      <div class="customers">
        Customers: {{ customers.length }}
      </div>
    </div>
  </section>
</template>

<script setup>
const user = useSupabaseUser();
const customersStore = useCustomersStore();
const { customers } = storeToRefs(customersStore);

onMounted(() => {
  if (user.value && !customers?.value?.length) {
    customersStore.fetchCustomers();
  }
});

useHead({
  title: 'Stats - Landsknecht'
});
</script>

<style scoped></style>