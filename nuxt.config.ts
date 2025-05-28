import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  // },
  // alias: {
  //   "~": "./src"
  // },
  app: {
    head: {
      title: 'Landsknecht'
    }
  },
  colorMode: {
    preference: 'light',
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  devServer: {
    port: 5000,
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', 'nuxt-tiptap-editor'],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:5000',
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
    app: {}
  },
  // vite: {
  //   plugins: [
  //     tailwindcss(),
  //   ],
  // },
});
