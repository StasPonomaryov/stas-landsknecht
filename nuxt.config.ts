import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // alias: {
  //   pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
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
  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt',],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:5000',
      FIREBASE_API_KEY: "AIzaSyB54d6N49x5sTUeRVk-YQzDYgioNwk0Jyg",
      FIREBASE_AUTH_DOMAIN: "freelance-stas.firebaseapp.com",
      FIREBASE_PROJECT_ID: "freelance-stas",
      FIREBASE_STORAGE_BUCKET: "freelance-stas.appspot.com",
      FIREBASE_MESSAGING_SENDER_ID: "91083954751",
      FIREBASE_APP_ID: "1:91083954751:web:066f6ee9325136bd5f768a"
    },
    app: {}
  },
  // vite: {
  //   plugins: [
  //     tailwindcss(),
  //   ],
  // },
});
