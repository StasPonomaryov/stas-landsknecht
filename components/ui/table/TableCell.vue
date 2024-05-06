<template>
  <td :class="clsx('table-body', props.class)">
    <slot />
  </td>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>

<style scoped></style>