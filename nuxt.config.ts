// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: "https://kimjuil.com",
    name: "KimJuil",
  },
  modules: [
    "@nuxthub/core",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-auth-utils",
    "@nuxt/content",
    "nuxt-og-image",
    "@nuxt/eslint",
  ],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-12-11",
  content: {
    experimental: {
      sqliteConnector: "native",
    },
  },
  hub: {
    db: "sqlite",
    kv: true,
    blob: true,
    cache: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  nitro: {
    prerender: {
      routes: [
        "/",
      ],
      crawlLinks: true,
    },
  },
});
