<template>
  <footer class="site-footer">
    <div class="copyright">&copy; Stas Ponomaryov, 2024</div>
    <div class="stats">
      <!-- <span title="Clients count">👨: {{ clientsStore.clients?.length || clientsLength }};</span> -->
      <!-- <span title="Tasks count">📝: {{ tasksStore.tasks?.length || tasksLength }};</span> -->
      <span class="hidden md:block" title="User ID">👑: {{ user?.uid }}</span>
    </div>
    <div class="build">1.0.3</div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<style scoped></style>