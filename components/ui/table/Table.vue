<template>
  <div class="relative w-full overflow-auto">
    <table :class="clsx('table w-full', props.class)">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
import clsx from 'clsx';

const props = defineProps(['class']);
</script>
