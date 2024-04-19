import { defineStore } from 'pinia';

interface ICustomersStore {
  value: Customers[]
}

export const useUserStore = defineStore("user", () => {
  const authenticated = useSupabaseUser();
  const user = ref<Account | null>(null);
  const customers = reactive<ICustomersStore>({ value: [] });
  const customersCount = ref(0);
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

  function setCustomers(data: Customers[]) {
    customers.value = data;
  }

  function setCustomersCount(count: number) {
    customersCount.value = count;
  }

  return { user, displayName, customers, customersCount, isLoggedIn, setUser, setCustomers, setCustomersCount };
});