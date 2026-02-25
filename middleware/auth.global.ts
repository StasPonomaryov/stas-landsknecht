export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (to.path === '/login') {
    return;
  }
  // Auth hydration is initialized in a client-only plugin.
  // Avoid waiting on server render to prevent SSR deadlock.
  if (import.meta.server) {
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
