<template>
  <header class="site-header">
    <div class="logo">
      <NuxtLink to="/">Landsknecht 🏰</NuxtLink>
    </div>
    <div v-if="user" class="user">
      <span class="greeting">Salut, </span>
      <NuxtLink to="#"><span class="username">{{ user?.displayName ?? user?.email }}</span></NuxtLink>
      <span class="link ml-2" @click="handleLogout">❌</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { signOutUser } = useFirebaseAuth()

const user = computed(() => authStore.user)
const userName = computed(() => authStore.getUserName())

const handleLogout = async () => {
  await signOutUser()
  navigateTo('/login')
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