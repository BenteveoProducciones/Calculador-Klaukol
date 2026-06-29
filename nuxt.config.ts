// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss'
  ],
  fonts: {
    families: [
      {
        name: 'Saira',
        provider: 'google',
        weights: [300, 400, 500, 600, 700, 800],
      }
    ],
    defaults: {
      weights: [300, 400, 500, 600, 700, 800],
    }
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  }
})