<template>
  <header class="site-header">
    <div class="logo">
      <NuxtLink to="/stats">Landsknecht 🏰</NuxtLink>
    </div>
    <div v-if="user" class="user">
      Salut,
      <NuxtLink to="/account"><b>{{ displayName }}</b></NuxtLink>
      <span class="link ml-2" @click="userLogout">❌</span>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '#imports';
const user = useSupabaseUser();
const { auth } = useSupabaseClient();
const store = useUserStore();
const { displayName } = storeToRefs(store);

const userLogout = async () => {
  await auth.signOut();
  navigateTo('/');
}
</script>

<style scoped>
</style>