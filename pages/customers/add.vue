<template>
  <section v-if="user" class="grid cards customers">
    <div class="customers-control">
      <h2>Add a customer</h2>
      <form class="form-widget" @submit.prevent="saveCustomer">
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
            @change="v$.description.$touch" :class="{ 'input-error': v$.description.$error }"
            v-model="formData.description" />
        </div>
        <div class="input-area">
          <label for="customerContacts" class="input-label">
            Contacts <span class="required">*</span>
          </label>
          <textarea class="textarea" name="customerContacts" v-model="formData.contacts" @change="v$.contacts.$touch"
            :class="{ 'input-error': v$.contacts.$error }">{{ formData.contacts }}</textarea>
        </div>
        <div v-if="succeed" class="success-text mb-1">Saved {{ addedCustomer }}</div>
        <div class="input-area">
          <input type="submit" class="btn btn-primary" :value="loading ? '💤' : '➕Add'" :disabled="loading" />
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const user = useSupabaseUser();
const addedCustomer = ref('');
const loading = ref(false);
const succeed = ref(false);
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

async function saveCustomer() {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    const { data: newCustomer } = await useFetch('/api/customers/add', 
    {
      method: 'POST',
      body: {
        name: formData.name,
        description: formData.description,
        contacts: formData.contacts
      }
    });
    if (newCustomer.value) {
      addedCustomer.value = newCustomer.value.name;
      succeed.value = true;
      resetUserForm();
      v$.value.name.$reset();
      v$.value.description.$reset();
      v$.value.contacts.$reset();
      loading.value = false;
    }
  }
}

useHead({
  title: 'Add a customer - Landsknecht'
});
</script>

<style scoped>
.customers-control {
  max-width: 300px;
}

.input-text,
.textarea {
  width: calc(300px - 1rem);
}
</style>