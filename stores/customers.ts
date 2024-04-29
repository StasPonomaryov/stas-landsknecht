import { useStorage } from '@vueuse/core';

const STORE_NAME = 'sl-customers';

export const useCustomersStore = defineStore('customersStore', () => {
  const customers = useStorage<Customer[]>(STORE_NAME, []);
  const loading = ref(false);
  const fetchCustomers = async () => {
    try {
      loading.value = true;
      const response = await $fetch<Customer[]>(`/api/customers/get/`);
      customers.value = response;
    } catch (error) {
      loading.value = false;
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  return {
    loading,
    customers,
    fetchCustomers
  }
});
