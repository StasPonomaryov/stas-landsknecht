<template>
  <section>
    <h2>Tasks<span class="badge">{{ tasks.length }}</span></h2> 
    <div class="container py-5 mx-auto" v-if="tasks.length">
      <TasksTable :data="tasks" :columns="columns"/>
    </div>
    <div v-else class="">Waiting for data...</div>
  </section>
</template>

<script setup lang="ts">
import { columns } from '~/components/tasks/columns';

const tasksStore = useTasksStore();
const { tasks } = storeToRefs(tasksStore);
const user = useCurrentUser();

if (!tasks?.value?.length) {
  tasksStore.fetchUserTasks(user.value?.uid);
}

useHead({
  title: 'Tasks table - Landsknecht'
});
</script>

<style scoped></style>