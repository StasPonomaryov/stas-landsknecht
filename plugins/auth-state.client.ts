import type { Auth } from 'firebase/auth';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const { $auth } = useNuxtApp();
  const authStore = useAuthStore();

  if (!$auth) {
    authStore.setAuthResolved(true);
    return;
  }

  authStore.initializeAuth($auth as Auth);
});
