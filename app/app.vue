<script setup>
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#16a34a" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
  ],
  link: [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "manifest", href: "/manifest.webmanifest" },
    {
      rel: "apple-touch-icon",
      href: "/smartphone-icons/ios/apple-icons.png",
    },
  ],
  htmlAttrs: {
    lang: "ja",
  },
});

const title = "日本ハイスコア協会まとめ";
const description =
  "日本ハイスコア協会のスコアをまとめた非公式サイトです。公式サイトからスクレイピングしてデータを取得しています。";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://jha-summary.wefma.net/images/ogp.png",
});

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
});

const navigationLinks = [
  {
    label: "ホーム",
    to: "/",
  },
  {
    label: "概要",
    to: "/about",
  },
  {
    label: "更新履歴",
    to: "/changelog",
  },
];
</script>

<template>
  <UApp>
    <header class="border-b border-default bg-default/75 backdrop-blur">
      <UContainer
        class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <NuxtLink to="/" class="text-lg font-bold text-highlighted">
            日本ハイスコア協会まとめ
          </NuxtLink>
          <p class="text-sm text-muted">
            日本ハイスコア協会のデータを見やすくまとめる非公式サイト
          </p>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="link in navigationLinks"
            :key="link.to"
            :to="link.to"
            color="neutral"
            variant="ghost"
          >
            {{ link.label }}
          </UButton>
        </nav>
      </UContainer>
    </header>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          <NuxtLink to="https://wefma.net">Wefmaika</NuxtLink> all rights
          reserved
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/wefma"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://twitter.com/iyuzzuko"
          target="_blank"
          icon="i-simple-icons-twitter"
          aria-label="Twitter"
          color="neutral"
          variant="ghost"
        />
        <UButton
          to="https://wefma.net"
          target="_blank"
          icon="i-simple-icons-homepage"
          aria-label="Homepage"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
