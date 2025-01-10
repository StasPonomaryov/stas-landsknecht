<template>
  <input
    class="input-text"
    type="text"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

console.log('>>>value', props.modelValue);

</script>
