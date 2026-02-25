export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (to.path === '/login') {
    return;
  }

  if (!authStore.isAuthResolved) {
    await new Promise<void>((resolve) => {
      const stop = watch(
        () => authStore.isAuthResolved,
        (isResolved) => {
          if (isResolved) {
            stop();
            resolve();
          }
        },
        { immediate: true }
      );
    });
  }

  if (!authStore.user) {
    return navigateTo('/login');
  }
});
