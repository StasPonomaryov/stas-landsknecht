import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    return;
  }

  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    nuxtApp.provide('auth', auth);
    nuxtApp.provide('firestore', firestore);
  } catch (err) {
    console.error('[firebase] Initialization failed:', err);
    nuxtApp.provide('auth', null as Auth | null);
    nuxtApp.provide('firestore', null as Firestore | null);
  }
});
