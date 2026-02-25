export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (to.path === '/login') {
    if (import.meta.client && authStore.user) {
      return navigateTo('/');
    }

    return;
  }

  // This project resolves auth only on the client via Firebase SDK.
  // On SSR we cannot confirm session, so always redirect protected pages
  // to avoid rendering private layout/content and hydration mismatches.
  if (import.meta.server) {
    return navigateTo('/login');
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
