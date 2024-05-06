<template>
  <thead :class="clsx('table-header', props.class)">
    <slot />
  </thead>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>

<style scoped></style>