<template>
  <section v-if="user" class="customers">
    <h2>Remove client</h2>
    <div class="grid cards left">
      <div class="customers-control">
        <ClientOnly>
          <Vueform v-if="clients">
            <SelectElement name="clients" :native="false"
              :items="clients.map((c) => ({ value: c.id, label: c.name }))" :search="true" @select="clientSelected"
              @clear="searchCleared" autocomplete="on" ref="search" />
          </Vueform>
        </ClientOnly>
        <div>
          <form class="form-widget">
            <div class="input-area">
              <label for="clientName" class="input-label">
                Name <span class="required">*</span>
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
                Contacts <span class="required">*</span>
              </label>
              <textarea class="textarea" name="clientContacts" v-model="formData.contacts"
                @change="v$.contacts.$touch" :class="{
                  'input-error': v$.contacts.$error,
                  'input-valid': !v$.name.$invalid
                }">{{ formData.contacts }}</textarea>
            </div>
            <div v-if="succeed" class="success-text mb-1">Client was removed</div>
            <div class="input-area">
              <input type="button" class="btn btn-primary" :value="loading ? '💤' : '🗑️Remove'"
                :disabled="loading || v$.$invalid" @click="openModal" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  <Modal :isOpen="isModalOpened" @modal-close="closeModal" @submit="removeClient" name="first-modal">
    <template #header>Removing client</template>
    <template #content>Do you really want to remove client {{ selectedClient }} from database?</template>
  </Modal>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const user = useCurrentUser();
const clientsStore = useClientsStore();
const route = useRoute();
const search = ref(null);
const removeId = ref(route.query.id || null);
const { clients } = storeToRefs(clientsStore);
const selectedClient = ref('');
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

if (!clients?.value?.length) {
  clientsStore.fetchUserClients(user.value?.uid);
}

const clientSelected = (e) => {
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

async function removeClient() {
  v$.value.$validate();
  if (!v$.value.$error) {
    loading.value = true;
    await clientsStore.deleteClient(selectedClient.value);
    //const newClients = clients.value.filter((i) => i.id !== selectedClient.value);
    //console.log('>>>FILTERED', newClients);
    isModalOpened.value = false;
    //clients.value = newClients;
    succeed.value = true;
    loading.value = false;
    searchCleared();
  }
}

if (removeId.value) {
  clientSelected(Number(removeId.value));
}

watch(succeed, () => {
  search.value.clear();
});

useHead({
  title: 'Remove client - Landsknecht'
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
