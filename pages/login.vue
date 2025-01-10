<template>
  <section class="login-control text-center">
    <h2>Sign in to your account</h2>
    <button class="btn btn-primary"
      @click="signInWithGithub">Github
    </button>
  </section>
</template>
<script setup lang="ts">
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';

const auth = useFirebaseAuth()!;
const router = useRouter();

async function signInWithGithub() {
  await signInWithPopup(auth, new GithubAuthProvider())
  return router.push('/');
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