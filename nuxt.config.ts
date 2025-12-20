// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxthub/core",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@nuxt/fonts",
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/image",
    "nuxt-auth-utils",
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
  routeRules: {
    // If not using `defineRouteRules` in the page component
    "/blog": { prerender: true },
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
});
