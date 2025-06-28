<template>
  <section class="login-control text-center">
    <h2>Welcome to Landsknecht</h2>
    <p>Please, sign in</p>
    <button class="btn btn-primary" @click="handleLogin">Github
    </button>
    <div class="text-sm text-red-500" v-if="error">
      {{ error }}
    </div>
  </section>
</template>
<script setup lang="ts">
const router = useRouter();
const { signInWithGitHub } = useFirebaseAuth();
const loading = ref(false);
const error = ref<string|null>('');
const handleLogin = async () => {
  loading.value = true
  error.value = null

  try {
    const user = await signInWithGitHub();
    console.log('User:', user);
    
    if (user) {
      await router.push('/')
    }
  } catch (err) {
    error.value = 'Failed to login with GitHub'
    console.error(err)
  } finally {
    loading.value = false
  }
}
definePageMeta({
  title: 'Login',
  description: 'Login to your account',
  image: '/images/login.png',
  url: '/login',
  layout: 'guest'
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