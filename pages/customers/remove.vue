<template>
  <section v-if="user" class="customers">
    <h2>Remove customer</h2>
    <div class="grid cards">
      <div class="customers-control">
        <ClientOnly>
          <Vueform v-if="customers">
            <SelectElement name="customers" :native="false"
              :items="customers.map((c) => ({ value: c.id, label: c.name }))" :search="true" @select="customerSelected"
              @clear="searchCleared" autocomplete="on" ref="search" />
          </Vueform>
        </ClientOnly>
        <div>
          <form class="form-widget">
            <div class="input-area">
              <label for="customerName" class="input-label">
                Name <span class="required">*</span>
              </label>
              <input class="input-text" name="customerName" placeholder="e.g. John" type="text" @change="v$.name.$touch"
                :class="{
                  'input-error': v$.name.$error,
                  'input-valid': !v$.name.$invalid
                }" v-model="formData.name" />
            </div>
            <div class="input-area">
              <label for="customerDescription" class="input-label">
                Description
              </label>
              <input class="input-text" name="customerDescription" placeholder="e.g. annoying uncle" type="text"
                @change="v$.description.$touch" :class="{
                  'input-error': v$.description.$error,
                  'input-valid': !v$.name.$invalid
                }" v-model="formData.description" />
            </div>
            <div class="input-area">
              <label for="customerContacts" class="input-label">
                Contacts <span class="required">*</span>
              </label>
              <textarea class="textarea" name="customerContacts" v-model="formData.contacts"
                @change="v$.contacts.$touch" :class="{
                  'input-error': v$.contacts.$error,
                  'input-valid': !v$.name.$invalid
                }">{{ formData.contacts }}</textarea>
            </div>
            <div v-if="succeed" class="success-text mb-1">Customer was removed</div>
            <div class="input-area">
              <input type="button" class="btn btn-primary" :value="loading ? '💤' : '🗑️Remove'"
                :disabled="loading || v$.$invalid" @click="openModal" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  <Modal :isOpen="isModalOpened" @modal-close="closeModal" @submit="removeCustomer" name="first-modal">
    <template #header>Removing customer</template>
    <template #content>Do you really want to remove customer {{ selectedCustomer }} from database?</template>
  </Modal>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const user = useSupabaseUser();
const customersStore = useCustomersStore();
const search = ref(null);
const { customers } = storeToRefs(customersStore);
const selectedCustomer = ref('');
const loading = ref(false);
const succeed = ref(false);
const getInitialFormData = () => ({
  name: '',
  description: '',
  contacts: ''
});
const formData = reactive(getInitialFormData());
const resetUserForm = () => Object.assign(formData, getInitialFormData());
const isModalOpened = ref(false);

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage('Name is required', required),
      minLength: minLength(4)
    },
    description: { minLength: minLength(6) },
    contacts: {
      required: helpers.withMessage('Contacts are required', required),
      minLength: minLength(10)
    }
  }
});

const v$ = useVuelidate(rules, formData);

if (!customers.value) {
  customersStore.fetchCustomers();
}

const customerSelected = (e) => {
  selectedCustomer.value = e;
  const target = getCustomer;
  Object.assign(formData, {
    name: target.value.name,
    description: target.value.description,
    contacts: target.value.contacts
  });
  succeed.value = false;
};

const searchCleared = () => {
  selectedCustomer.value = null;
  resetUserForm();
  v$.value.name.$reset();
  v$.value.description.$reset();
  v$.value.contacts.$reset();
}

const getCustomer = computed(() => {
  if (customers.value.length) {
    return customers.value.find((c) => c.id === selectedCustomer.value);
  };
});

async function removeCustomer() {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    await $fetch('/api/customers/remove',
      {
        method: 'POST',
        body: {
          id: selectedCustomer.value
        }
      });
    const newCustomers = customers.value.filter((i) => i.id !== selectedCustomer.value);
    console.log('>>>FILTERED', newCustomers);
    isModalOpened.value = false;
    customers.value = newCustomers;
    succeed.value = true;
    loading.value = false;
    searchCleared();
  }
}

watch(succeed, () => {
  search.value.clear();
});

useHead({
  title: 'Remove customer - Landsknecht'
});
</script>

<style scoped>
.input-text,
.textarea {
  width: calc(300px - 1rem);
}

.form-widget {
  margin-top: 1rem;
}
</style>
