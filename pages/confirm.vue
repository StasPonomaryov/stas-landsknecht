<template>
  <section>
    <p>🔄 Redirecting...</p>
  </section>
</template>

<script setup lang="ts">
const user = await getCurrentUser()

watch(user, () => {
  if (user.value) {        
    return navigateTo('/stats');
  }
}, { immediate: true });
</script>