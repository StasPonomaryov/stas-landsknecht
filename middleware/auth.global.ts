export default defineNuxtRouteMiddleware(async (to, form) => { 
  const user = await getCurrentUser()

  if (user && to.name === 'login') {
    return navigateTo('/')
  }

  if (!user && to.name !== 'login') {
    return navigateTo('/login')
  }
});
