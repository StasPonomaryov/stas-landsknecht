<template>
  <tr :class="clsx('table-row', props.class)">
    <slot />
  </tr>
</template>

<script setup>
import clsx from 'clsx';

const props = defineProps(['class']);
</script>