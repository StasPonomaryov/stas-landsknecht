<template>
  <footer class="site-footer">
    <div class="copyright">&copy; Stas Ponomaryov, 2024</div>
    <div class="stats">
      <span title="Clients count">👨: {{ clientsStore.clients?.length || clientsLength }};</span>
      <span title="Tasks count">📝: {{ tasksStore.tasks?.length || tasksLength }};</span>
      <span title="User ID">👑: {{ user.uid }}</span>
    </div>
    <div class="build">1.01</div>
  </footer>
</template>

<script setup>
import { useTasksStore } from '~/stores/tasks';
import { useClientsStore } from '~/stores/clients';

const user = useCurrentUser();
const tasksStore = useTasksStore();
const clientsStore = useClientsStore();
const clientsLength = ref(0);
const tasksLength = ref(0);

if (!clientsStore.clients?.length) {
  clientsLength.value = await clientsStore.getClientsCount();
}

if (!tasksStore.tasks?.length) {
  tasksLength.value = await tasksStore.getTasksCount();
}
</script>

<style scoped></style>