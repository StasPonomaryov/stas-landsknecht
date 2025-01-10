<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" ref="target">
        <div class="modal-header">
          <slot name="header"> Dialog header </slot>
        </div>
        <div class="modal-body">
          <slot name="content"> default content </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button class="btn btn-primary" @click.emit="emit('submit')">OK</button>
            <button class="btn btn-secondary" @click.stop="emit('modal-close')">Cancel</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close, submit"]);

const target = ref(null);
</script>

<style scoped>
.modal-mask {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9998;
}

.modal-container {
  background-color: var(--main-bg-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 0.5rem;
  margin: 150px auto;
  padding: 1.5rem 2rem;
  width: clamp(200px, 300px, 25vw);
}

.modal-header {
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1.25;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.25rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>