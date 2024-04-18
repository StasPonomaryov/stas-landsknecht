<template>
  <footer class="site-footer">
    <div class="copyright">&copy; Stas Ponomaryov, 2024</div>
    <div class="stats">👨: {{ customersCount }}; 📝: {{ orders }};</div>
    <div class="build">1.00</div>
  </footer>
</template>

<script setup>
import { useUserStore } from '#imports';
const store = useUserStore();
const { customersCount } = storeToRefs(store);
const orders = ref(0);
</script>

<style scoped></style>