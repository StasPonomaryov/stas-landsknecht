<template>
  <section v-if="user" class="tasks add">
    <h2>Add task</h2>
    <ClientOnly>
      <form class="flex w-full gap-4" @submit.prevent="saveTask">
        <div class="flex flex-col lg:w-1/3">
          <Vueform>
            <SelectElement v-if="clients" name="clients" autocomplete="off" :native="false" label="Client"
              :items="clients.map((c) => ({ value: c.id, label: c.name }))" :search="true" @select="clientSelected"
              @clear="searchCleared" ref="search" />
            
          </Vueform>
        </div>
        <div class="flex flex-col lg:w-3/4">
          <Vueform>
            <TextElement label="Task title" name="title" />
          </Vueform>
        </div>
      </form>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const user = useCurrentUser();
const selectedClient = ref<string | null>(null);
const addedTask = ref('');
const loading = ref(false);
const succeed = ref(false);
const failed = ref('');
const getInitialFormData = () => ({
  client: '',
  title: '',
  description: '',
  dateStart: new Date().toISOString().split('T')[0],
  dateEnd: null,
  priceStart: 0,
  priceEnd: 0,
  hours: 0,
  status: 'processing'
});
const formData = reactive(getInitialFormData());

const resetUserForm = () => Object.assign(formData, getInitialFormData());

const rules = computed(() => {
  return {
    client: {
      required: helpers.withMessage('Client is required', required),
      minLength: minLength(4)
    },
    title: {
      required: helpers.withMessage('Title is required', required),
      minLength: minLength(4)
    },
    description: { minLength: minLength(6) },
    dateStart: {
      required: helpers.withMessage('Date started is required', required),
      // dateFormat: 'yyyy-MM-dd',
      minLength: minLength(10)
    },
    dateEnd: {
      // date_format: 'yyyy-MM-dd',
      minLength: minLength(10)
    },
    priceStart: {
      minLength: minLength(10)
    },
    priceEnd: {
      minLength: minLength(10)
    },
    hours: {
      minLength: minLength(10)
    },
    status: {
      minLength: minLength(10)
    }
  }
});

const v$ = useVuelidate(rules, formData);

const getClient = computed(() => {
  if (clients.value.length) {
    return clients.value.find((c) => c.id === selectedClient.value);
  };
});

const clientSelected = (e) => {
  console.log('>>>SELECTED', e);

  selectedClient.value = e;
  const target = getClient;
  Object.assign(formData, {
    client: target.value?.id,
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

async function saveTask() {
  console.log('Task saving');
  v$.value.$validate();
  if (!v$.value.$error) {
    console.log('No errors');
  }
}

onMounted(() => {
  if (!clients.value.length) {
    clientsStore.fetchUserClients(user.value?.uid);
  }
});
</script>

<style scoped></style>