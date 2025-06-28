export default defineNuxtRouteMiddleware(async (to, from) => { 
  const authStore = useAuthStore()
  const user = authStore.user

  if (to.path === '/login') {
    return
  }

  if (!user) {
    return navigateTo('/login')
  }
});