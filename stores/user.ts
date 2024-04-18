import { defineStore } from 'pinia';

interface ICustomersStore {
  value: Customers[]
}

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const customers = reactive<ICustomersStore>({ value: [] });
  const customersCount = ref(0);
  const isLoggedIn = computed(() => user.value !== null);

  function setUser(session: any) {
    user.value = session;
  }

  function setCustomers(data: Customers[]) {
    customers.value = data;
  }

  function setCustomersCount(count: number) {
    customersCount.value = count;
  }

  return { user, customers, customersCount, isLoggedIn, setUser, setCustomers, setCustomersCount };
});