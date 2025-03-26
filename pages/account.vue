<template>
  <section>
    <div class="text-center">
      <h2>Your account</h2>
    </div>
    <p><b>Email:</b> {{ user?.email }}</p>
  </section>
</template>

<script setup lang="ts">
const user = useCurrentUser();

definePageMeta({
  title: 'Account',
  description: 'Your account',
  url: '/account',
});
</script>

<style scoped></style>