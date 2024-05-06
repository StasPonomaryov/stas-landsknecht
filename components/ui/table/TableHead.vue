<template>
  <th :class="clsx('table-head', props.class)">
    <slot />
  </th>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>