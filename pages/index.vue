<template>
  <section class="login-control text-center">
    <h2>Sign in to your account</h2>
    <button class="btn btn-primary"
      @click="auth.signInWithOAuth({ provider: 'github', options: { redirectTo } })">Github
    </button>
  </section>
</template>

<script setup>
const user = useSupabaseUser();
const { auth } = useSupabaseClient();

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

watchEffect(() => {
  if (user.value) {
    navigateTo('/stats');
  }
})

definePageMeta({
  layout: 'guest'
});

useHead({
  title: 'Welcome - Landsknecht'
});
</script>

<style scoped>
.login-control {
  padding: 1.5rem 2.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.login-form input {
  margin-bottom: 1rem;
  width: 100%;
}

.login-form-footer {
  margin: 1rem 0;
  text-align: center;
}
</style>
