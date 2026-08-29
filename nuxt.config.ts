// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxthub/core",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
    "@nuxt/fonts",
    "@nuxt/ui",
    "@nuxtjs/seo",
    "@nuxt/content",
    "@nuxt/image",
    "nuxt-auth-utils",
    "@nuxt/eslint",
  ],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  site: {
    url: "https://kimjuil.com",
  },
  compatibilityDate: "2025-12-11",
  routeRules: {
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      },
    },
  },

  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 2,
        },
      },
    },
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

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
});
