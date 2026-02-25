// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  runtimeConfig: {
    public: {
      api:
        process.env.NUXT_PUBLIC_DEPLOY_ENV === "github_pages"
          ? "https://jha-summary-api-cors.wefma.net/jha-scores.json"
          : "http://localhost:3000/dev/jha-scores.json",
    },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
