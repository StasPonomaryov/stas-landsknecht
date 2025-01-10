<template>
  <section v-if="user" class="customers">
    <h2>Add a client</h2>
    <div class="grid cards left">
      <div class="customers-control">
        <form class="form-widget" @submit.prevent="saveClient">
          <div class="input-area">
            <label for="clientName" class="input-label">
              Name<span class="required">*</span>
            </label>
            <input class="input-text" name="clientName" placeholder="e.g. John" type="text" @change="v$.name.$touch"
              :class="{
                'input-error': v$.name.$error,
                'input-valid': !v$.name.$invalid
              }" v-model="formData.name" />
          </div>
          <div class="input-area">
            <label for="clientDescription" class="input-label">
              Description
            </label>
            <input class="input-text" name="clientDescription" placeholder="e.g. annoying uncle" type="text"
              @change="v$.description.$touch"
              :class="{ 'input-error': v$.description.$error, 'input-valid': !v$.description.$invalid }"
              v-model="formData.description" />
          </div>
          <div class="input-area">
            <label for="clientContacts" class="input-label">
              Contacts<span class="required">*</span>
            </label>
            <textarea class="textarea" name="clientContacts" v-model="formData.contacts" @change="v$.contacts.$touch"
              :class="{ 'input-error': v$.contacts.$error, 'input-valid': !v$.contacts.$invalid }">{{ formData.contacts }}</textarea>
          </div>
          <div v-if="succeed" class="success-text mb-1">Saved {{ addedClient }}</div>
          <div v-if="failed" class="fail-text mb-1">Failed to add client, {{ failed }}</div>
          <div class="input-area">
            <input type="submit" class="btn btn-primary" :value="loading ? '💤' : '➕Add'" :disabled="loading" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const user = useCurrentUser();
const addedClient = ref('');
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

if (!clients?.value) {
  clientsStore.fetchUserClients(user.value?.uid);
}

async function saveClient() {
  v$.value.$validate();
  if (!v$.value.$error) {
    try {
      loading.value = true;
      await clientsStore.addClient(formData);
      addedClient.value = formData.name;
      // const newClients = [...clients.value, formData];
      // clients.value = newClients;
      succeed.value = true;
      resetUserForm();
      v$.value.name.$reset();
      v$.value.description.$reset();
      v$.value.contacts.$reset();
      loading.value = false;
    } catch (error) {
      failed.value = error;
      loading.value = false;
    }
  }
}

useHead({
  title: 'Add a client - Landsknecht'
});
</script>

<style scoped>
.input-text,
.textarea {
  width: calc(300px - 1rem);
}
</style>