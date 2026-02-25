<script setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
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
});
</script>

<template>
  <UApp>
    <UHeader title="日本ハイスコア協会まとめ" :toggle="false" />

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
