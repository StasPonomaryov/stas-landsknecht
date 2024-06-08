<template>
  <section v-if="user" class="customers">
    <h2>Edit customer</h2>
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
          <form class="form-widget" @submit.prevent="updateCustomer">
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
            <div v-if="succeed" class="success-text mb-1">Saved {{ updatedCustomer }}</div>
            <div v-if="failed" class="fail-text mb-1">Failed to update customer, {{ failed }}</div>
            <div class="input-area">
              <input type="submit" class="btn btn-primary" :value="loading ? '💤' : '✅Update'"
                :disabled="loading || v$.$invalid" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const user = useSupabaseUser();
const customersStore = useCustomersStore();
const route = useRoute();
const search = ref(null);
const editId = ref(route.query.id || null);
const { customers } = storeToRefs(customersStore);
const selectedCustomer = ref('');
const updatedCustomer = ref('');
const loading = ref(false);
const succeed = ref(false);
const failed = ref('');
const getInitialFormData = () => ({
  name: '',
  description: '',
  contacts: ''
});
const formData = reactive(getInitialFormData());
const resetUserForm = () => Object.assign(formData, getInitialFormData());

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
  try {
    const { data } = await useFetch(`/api/customers/get`);
    if (data) {
      store.setCustomers(data.value);
    }
  } catch (e) {
    throw e;
  }
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

async function updateCustomer() {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    try {
      const editedCustomer = await $fetch('/api/customers/update',
        {
          method: 'POST',
          body: {
            name: formData.name,
            description: formData.description,
            contacts: formData.contacts,
            id: selectedCustomer.value,
            user_id: user.value.id
          }
        });
      if (editedCustomer) {
        updatedCustomer.value = editedCustomer.name;
        const newCustomers = [...customers.value];
        const updatedIndex = newCustomers.findIndex((c) => c.id === editedCustomer.id);
        newCustomers[updatedIndex] = editedCustomer;
        customers.value = newCustomers;
        succeed.value = true;
        loading.value = false;
        searchCleared();
      }
    } catch (error) {
      failed.value = error;
      loading.value = false;
    }
  }
}

if (editId.value) {
  customerSelected(Number(editId.value));
}

watch(succeed, () => {
  search.value.clear();
});

useHead({
  title: 'Edit customer - Landsknecht'
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
