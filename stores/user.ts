import { defineStore } from 'pinia';

export const useUserStore = defineStore("user", () => {
  const authenticated = useSupabaseUser();
  const user = ref<Account | null>(null);
  const isLoggedIn = computed(() => user.value !== null);
  const displayName = computed(() => {
    if (!user.value && authenticated.value) {
      let name = authenticated.value.id;
      if (authenticated.value.email) {
        name = getUsername(authenticated.value.email)
      }
      return name;
    }
    if (user.value?.username) {
      return user.value.username
    }
    if (user.value?.email) {
      return getUsername(user.value.email)
    }
  });

  function setUser(session: any) {
    user.value = session;
  }

  return {
    user,
    displayName,
    isLoggedIn,
    setUser,
  };
});