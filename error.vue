<template>
  <div class="site-wrapper">
    <div class="content-wrapper">
      <div class="narrow-centered">
        <h1>{{ error.statusCode }}</h1>
        <h2>Ooops.</h2>
        <p class="error-message">{{ error.message }}</p>
        <button class="btn btn-primary" @click="handleClearError">👈 Back to home</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['error']);

const handleClearError = () => clearError({ redirect: '/' });

</script>

<style scoped>
.error-message {
  margin-bottom: 1rem;
}
</style>