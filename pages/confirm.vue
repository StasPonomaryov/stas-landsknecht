<template>
  <section>
    <p>🔄 Redirecting...</p>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
const store = useUserStore();
const user = useSupabaseUser();

watch(user, () => {
  if (user.value) {        
    store.setUser(user.value);

    return navigateTo('/stats');
  }
}, { immediate: true });
</script>
