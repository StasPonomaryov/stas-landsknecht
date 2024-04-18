<template>
  <section class="grid cards stats">
    <h2>Statistics</h2>
    Customers: {{ customersCount }}
  </section>
</template>

<script setup>
import { useUserStore } from '#imports';
const store = useUserStore();
const { customersCount, isLoggedIn, user } = storeToRefs(store);

if (isLoggedIn.value) {
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

<style scoped>

</style>