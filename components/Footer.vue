<template>
  <footer class="site-footer">
    <div class="copyright">&copy; Stas Ponomaryov, 2024</div>
    <div class="stats">👨: {{ customers.length }}; 📝: {{ orders }};</div>
    <div class="build">1.00</div>
  </footer>
</template>

<script setup>
const user = useSupabaseUser();
const customersStore = useCustomersStore();
const { customers } = storeToRefs(customersStore);
const orders = ref(0);

onMounted(() => {
  if (user.value && !customers?.value?.length) {
    customersStore.fetchCustomers();
  }
});

</script>

<style scoped></style>