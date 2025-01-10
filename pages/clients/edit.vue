<template>
  <section v-if="user" class="customers">
    <h2>Edit client</h2>
    <div class="grid cards left">
      <div class="customers-control">
        <ClientOnly>
          <Vueform v-if="clients">
            <SelectElement name="clients" :native="false" :items="clients.map((c) => ({ value: c.id, label: c.name }))"
              :search="true" @select="clientSelected" @clear="searchCleared" autocomplete="on" ref="search" />
          </Vueform>
        </ClientOnly>
        <div>
          <form class="form-widget" @submit.prevent="updateClient">
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
                @change="v$.description.$touch" :class="{
                  'input-error': v$.description.$error,
                  'input-valid': !v$.name.$invalid
                }" v-model="formData.description" />
            </div>
            <div class="input-area">
              <label for="clientContacts" class="input-label">
                Contacts<span class="required">*</span>
              </label>
              <textarea class="textarea" name="clientContacts" v-model="formData.contacts" @change="v$.contacts.$touch"
                :class="{
                  'input-error': v$.contacts.$error,
                  'input-valid': !v$.name.$invalid
                }">{{ formData.contacts }}</textarea>
            </div>
            <div v-if="succeed" class="success-text mb-1">Saved {{ updatedClient }}</div>
            <div v-if="failed" class="fail-text mb-1">Failed to update client, {{ failed }}</div>
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
const user = useCurrentUser();
const clientsStore = useClientsStore();
const route = useRoute();
const search = ref(null);
const editId = ref(route.query.id || null);
const { clients } = storeToRefs(clientsStore);
const selectedClient = ref('');
const updatedClient = ref('');
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

if (!clients?.value?.length) {
  clientsStore.fetchUserClients(user.value?.uid);
}

const v$ = useVuelidate(rules, formData);
if (!clients.value) {
  try {
    const { data } = await useFetch(`/api/clients/get`);
    if (data) {
      store.setClients(data.value);
    }
  } catch (e) {
    throw e;
  }
}

const clientSelected = (e) => {
  console.log('>>>SELECTED', e);
  
  selectedClient.value = e;
  const target = getClient;
  Object.assign(formData, {
    name: target.value.name,
    description: target.value.description,
    contacts: target.value.contacts
  });
  succeed.value = false;
};

const searchCleared = () => {
  selectedClient.value = null;
  resetUserForm();
  v$.value.name.$reset();
  v$.value.description.$reset();
  v$.value.contacts.$reset();
}

const getClient = computed(() => {
  if (clients.value.length) {
    return clients.value.find((c) => c.id === selectedClient.value);
  };
});

async function updateClient() {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    try {
      const editedClient = {
        id: selectedClient.value,
        name: formData.name,
        description: formData.description,
        contacts: formData.contacts
      };
      console.log('>>>EDITED', editedClient);
      console.log('>>>SELECTED', selectedClient.value);
      await clientsStore.updateClient(selectedClient.value.trim(), editedClient);
      updatedClient.value = editedClient.name;
      // const newClients = [...clients.value];
      // const updatedIndex = newClients.findIndex((c) => c.id === editedClient.id);
      // newClients[updatedIndex] = editedClient;
      // clients.value = newClients;
      succeed.value = true;
      loading.value = false;
      searchCleared();
    } catch (error) {
      failed.value = error;
      loading.value = false;
    }
  }
}

if (editId.value) {
  clientSelected(Number(editId.value));
}

watch(succeed, () => {
  search.value.clear();
});

useHead({
  title: 'Edit client - Landsknecht'
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
