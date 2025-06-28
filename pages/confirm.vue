<template>
  <section>
    <p>🔄 Redirecting...</p>
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFirebaseAuth } from '~/composables/useFirebaseAuth';

const router = useRouter();
const isLoading = ref(true);
const error = ref<string | null>(null);

const checkAuth = async () => {
  try {
    const { getCurrentUser } = useFirebaseAuth();
    const user = await getCurrentUser();
    // console.log('User in confirmation:', user);

    if (user) {
      await router.push('/');
    } else {
      await router.push('/login');
    }
  } catch (err) {
    error.value = 'Authentication check failed';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkAuth();
});
</script>