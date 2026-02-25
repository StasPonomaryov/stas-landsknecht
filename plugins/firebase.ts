import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const isFirebaseConfigValid = (config: Record<string, string | undefined>) => {
  return Object.values(config).every((value) => typeof value === 'string' && value.trim().length > 0);
};

export default defineNuxtPlugin({
  name: 'firebase',
  setup(nuxtApp) {
    const config = useRuntimeConfig();

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
    };

    if (!isFirebaseConfigValid(firebaseConfig)) {
      console.warn('[firebase] Firebase config is incomplete. Auth/Firestore are disabled.');

      nuxtApp.vueApp.provide('auth', null as Auth | null);
      nuxtApp.provide('auth', null as Auth | null);

      nuxtApp.vueApp.provide('firestore', null as Firestore | null);
      nuxtApp.provide('firestore', null as Firestore | null);

      return;
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    nuxtApp.vueApp.provide('auth', auth);
    nuxtApp.provide('auth', auth);

    nuxtApp.vueApp.provide('firestore', firestore);
    nuxtApp.provide('firestore', firestore);
  },
});
