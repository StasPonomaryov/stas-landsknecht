<template>
  <td :class="clsx('table-body', props.class)">
    <slot />
  </td>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>

<style scoped>
.selected {
  background-color: rgb(var(--selected-bg-color));
  color: rgb(var(--selected-text-color));
}
</style>