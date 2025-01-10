<template>
  <select
    class="form-select"
    @change="handleChange"
    :value="defaultOption"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: number[];
  defaultOption: number;
}>();

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update', Number(target.value));
}
</script>

<style scoped>
.form-select {
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
</style>
