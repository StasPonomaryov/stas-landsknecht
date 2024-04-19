// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    'nuxt-security',
    '@pinia/nuxt',
    '@vueform/nuxt'
  ],
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm'
    }
  },
  devServer: {
    port: 5000
  },
  app: {
    head: {
      title: 'Landsknecht'
    }
  },
  css: [
    '~/assets/css/styles.css',
  ],
  security: {
    corsHandler: {
      origin: '*'
    }
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:5000'
    }
  },
})