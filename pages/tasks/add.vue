<template>
  <section v-if="user" class="tasks add">
    <h2>Add task</h2>
    <div class="grid cards left">
      <div class="customers-control">
        <VueForm class="form-widget" @submit.prevent="saveTask">

            <label for="clientName" class="input-label">
              Name<span class="required">*</span>
            </label>
            <TextElement name="title" :native="false" :search="true" />        
        </VueForm>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
const clientsStore = useClientsStore();
const { clients } = storeToRefs(clientsStore);
const user = useCurrentUser();
const addedTask = ref('');
const loading = ref(false);
const succeed = ref(false);
const failed = ref('');
// const getInitialFormData = () => ({
//   client: '',
//   title: '',
//   description: '',
//   dateStart: new Date().toISOString().split('T')[0],
//   dateEnd: null,
//   priceStart: 0,
//   priceEnd: 0,
//   hours: 0,
//   status: 'processing'
// });
// const formData = reactive(getInitialFormData());

// const resetUserForm = () => Object.assign(formData, getInitialFormData());

// const rules = computed(() => {
//   return {
//     client: {
//       required: helpers.withMessage('Client is required', required),
//       minLength: minLength(4)
//     },
//     title: {
//       required: helpers.withMessage('Title is required', required),
//       minLength: minLength(4)
//     },
//     description: { minLength: minLength(6) },
//     dateStarted: {
//       required: helpers.withMessage('Date started is required', required),
//       date_format: 'yyyy-MM-dd',
//       minLength: minLength(10)
//     },
//     dateEnded: {
//       date_format: 'yyyy-MM-dd',
//       minLength: minLength(10)
//     },
//     priceStart:{
//       minLength: minLength(10)
//     }
//   }
// });

// const v$ = useVuelidate(rules, formData);

async function saveTask() {
  console.log('Task saved');
  
}

if (!clients?.value) {
  clientsStore.fetchUserClients(user.value?.uid);
}
</script>

<style scoped></style>