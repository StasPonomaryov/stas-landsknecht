<template>
  <header class="site-header">
    <div class="logo">Landsknecht 🏰</div>
    <div v-if="user" class="user">
      Salut,
      <NuxtLink to="/account"><b>{{ displayName }}</b></NuxtLink>
      <span class="link ml-2" @click="userLogout">❌</span>
    </div>
  </header>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
import { getUsername } from '~/utils';
const displayName = ref('');

const userLogout = async () => {
  await auth.signOut();
  navigateTo('/');
}

if (user) {
  if (user.value.username) {
    displayName.value = user.value.username
  }
}

watchEffect(() => {
  if (!displayName.value.length) {
    displayName.value = getUsername(user.value.email);
  }
});
</script>

<style scoped>
.user a {
  color: #fff;
}
</style>