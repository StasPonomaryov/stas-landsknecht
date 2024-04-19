<template>
  <section class="stats">
    <h2>Statistics</h2>
    <div class="grid cards">
      <div class="customers">
        Customers: {{ customersCount }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { useUserStore } from '#imports';
const store = useUserStore();
const { customersCount, customers } = storeToRefs(store);

if (!customers.value.length) {
  try {
    const { data: count } = await useFetch(`/api/customers/get/?q=count`);
    if (count) {
      store.setCustomersCount(count);
    }
  } catch (e) {
    throw e;
  }
}

useHead({
  title: 'Stats - Landsknecht'
});
</script>

<style scoped></style>