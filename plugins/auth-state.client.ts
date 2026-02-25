import type { Auth } from 'firebase/auth';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const { $auth } = useNuxtApp();
  const authStore = useAuthStore();

  authStore.initializeAuth($auth as Auth);
});
