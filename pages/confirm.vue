<template>
  <section>
    <p>🔄 Redirecting...</p>
  </section>
</template>

<script setup lang="ts">
const router = useRouter();
const isLoading = ref(true);
const error = ref<string | null>(null);

const checkAuth = async () => {
  try {
    const { getCurrentUser } = useFirebaseAuth();
    const user = await getCurrentUser();
    console.log('User in confirmation:', user);
    
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