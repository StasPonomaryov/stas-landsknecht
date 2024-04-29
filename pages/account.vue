<template>
  <section class="account">
    <h2>Your account</h2>
    <div class="grid cards">
      <div class="account-control">
        <form class="form-widget" @submit.prevent="updateProfile">
          <div class="input-area">
            <label for="email" class="input-label">Email</label>
            <input class="input-text" id="email" type="text" :value="user?.email" disabled />
          </div>
          <div class="input-area">
            <label for="username" class="input-label">Username</label>
            <input class="input-text" id="username" type="text" v-model="username" />
          </div>
          <div class="input-area">
            <label for="website" class="input-label">Website</label>
            <input class="input-text" id="website" type="url" v-model="website" />
          </div>
          <div v-if="succeed" class="success-text mb-1">Updated {{ username }}</div>
          <div class="input-area">
            <input type="submit" class="btn btn-primary" :value="loading ? '💤' : '✅Update'" :disabled="loading" />
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
const user = useSupabaseUser();
const loading = ref(true);
const succeed = ref(false);
const username = ref('');
const website = ref('');
const avatar_path = ref('');

loading.value = true;

if (user.value) {
  try {
    const { data } = await useFetch(`/api/account/get/?id=${user.value.id}`);
    if (data) {
      username.value = data.value.username
      website.value = data.value.website
      avatar_path.value = data.value.avatar_url
    }
  } catch (error) {
    throw error;
  }
}

loading.value = false;

async function updateProfile() {
  try {
    loading.value = true;
    const user = useSupabaseUser();
    if (user.value) {
      await useFetch('/api/account/update',
        {
          method: 'POST',
          body: {
            id: user.value.id,
            username: username.value,
            website: website.value,
          }
        });
      succeed.value = true;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Account - Landsknecht'
});
</script>

<style>
.input-text {
  width: calc(300px - 1rem);
}
</style>