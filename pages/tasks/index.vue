<template>
  <section>
    <h2>Tasks<span class="badge">{{ tasks.length }}</span></h2> 
    <div class="w-full py-5 mx-auto" v-if="tasks.length">
      <TasksTable :data="tasks" :columns="columns"/>
    </div>
    <div v-else class="">Waiting for data...</div>
  </section>
  <Modal :isOpen="isModalOpened" @modal-close="closeModal" @submit="removeTask" name="first-modal">
    <template #header>Removing task</template>
    <template #content>Do you really want to remove task {{ selectedTask }} from database?</template>
  </Modal>
</template>

<script setup lang="ts">
import { columns } from '~/components/tasks/columns';

const tasksStore = useTasksStore();
const { tasks } = storeToRefs(tasksStore);
const user = useCurrentUser();
const isModalOpened = ref(false);
const selectedTask = ref('');

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const removeTask = () => {
  // tasksStore.removeTask(selectedTask.value);
  closeModal();
};

if (!tasks?.value?.length) {
  tasksStore.fetchUserTasks(user.value?.uid);
}

useHead({
  title: 'Tasks table - Landsknecht'
});
</script>

<style scoped></style>