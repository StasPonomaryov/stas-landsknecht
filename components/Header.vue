<template>
  <header class="site-header">
    <div class="logo">
      <NuxtLink to="/">Landsknecht 🏰</NuxtLink>
    </div>
    <div v-if="user" class="user">
      <span class="greeting">Salut, </span>
      <NuxtLink to="/account"><span class="username">{{ user.displayName ?? user.email }}</span></NuxtLink>
      <span class="link ml-2" @click="userLogout">❌</span>
    </div>
  </header>
</template>

<script setup>
import { signOut } from 'firebase/auth';

const auth = useFirebaseAuth();
const user = useCurrentUser();

const userLogout = async () => {
  await signOut(auth);
  navigateTo('/login');
}
</script>

<style scoped>
.username {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 150px;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}
</style>