import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function getGitCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
    }).trim();
  } catch {
    return "dev";
  }
}

const gitCommitHash = getGitCommitHash();
const api =
  process.env.NUXT_PUBLIC_DEPLOY_ENV === "github_pages"
    ? "https://jha-summary-api-cors.wefma.net/jha-scores.json"
    : "http://localhost:3000/dev/jha-scores.json";

const swTemplatePath = resolve(process.cwd(), "app/sw-template.js");
const publicDir = resolve(process.cwd(), "public");
const publicSwPath = resolve(publicDir, "sw.js");
const swTemplate = readFileSync(swTemplatePath, "utf8");

mkdirSync(publicDir, { recursive: true });
writeFileSync(
  publicSwPath,
  swTemplate
    .replaceAll("__GIT_COMMIT_HASH__", gitCommitHash)
    .replaceAll("__SCORES_API_URL__", api),
);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
    "/changelog": { prerender: true },
  },

  runtimeConfig: {
    public: {
      gitCommitHash,
      api,
    },
  },

  compatibilityDate: "2025-01-15",
});
