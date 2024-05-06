<template>
  <tbody :class="clsx('table-body', props.class)">
    <slot />
  </tbody>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>

<style scoped></style>