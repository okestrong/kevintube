// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2024-04-03',
   devtools: { enabled: true },
   modules: [
      '@nuxtjs/tailwindcss',
      'nuxt-quasar-ui',
      '@vee-validate/nuxt',
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      'shadcn-nuxt',
      '@vueuse/nuxt',
      '@nuxt/image',
   ],
   plugins: ['~/plugins/hello', '~/plugins/rest-api', '~/plugins/vue-query'],
   devServer: {
      port: 3001,
   },
   css: ['~/assets/css/global.css'],
   typescript: {
      typeCheck: true,
      tsConfig: {
         compilerOptions: {
            baseUrl: '.',
         },
      },
   },
   experimental: {
      payloadExtraction: false,
   },
   quasar: {
      lang: 'ko-KR',
   },
   shadcn: {
      /**
       * Prefix for all the imported component
       */
      prefix: '',
      /**
       * Directory that the component lives in.
       * @default "./components/ui"
       */
      componentDir: './components/ui',
   },
});
