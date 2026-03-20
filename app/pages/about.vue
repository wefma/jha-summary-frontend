<template>
  <UContainer>
    <UCard class="my-5">
      <template #header>
        <h1 class="text-xl font-bold">概要</h1>
        <p>
          このページは
          <NuxtLink
            class="text-blue-600 underline hover:no-underline"
            to="https://sites.google.com/view/jha-arcade"
            target="_blank"
          >
            日本ハイスコア協会
          </NuxtLink>
          のスコアをイイ感じにまとめて表示するための非公式ページです。
        </p>
        <p>
          本サイトは
          <a class="font-bold">
            日本ハイスコア協会とは一切関係がありません。
          </a>
        </p>
        <p>そのため予告なくサービスを停止する可能性があります。</p>
      </template>
    </UCard>
    <UCard class="my-5">
      <template #header>
        <h1 class="text-xl font-bold">ソースコード</h1>
        <ul>
          <li>
            <NuxtLink
              class="text-blue-600 underline hover:no-underline"
              to="https://github.com/wefma/jha-summary-frontend"
              target="_blank"
            >
              フロントエンド
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="text-blue-600 underline hover:no-underline"
              to="https://github.com/wefma/jha-summary"
              target="_blank"
            >
              バックエンド
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="text-blue-600 underline hover:no-underline"
              to="https://github.com/wefma/jha-cors-header-proxy"
              target="_blank"
            >
              バックエンドのプロキシ
            </NuxtLink>
          </li>
        </ul>
      </template>
    </UCard>
    <UCard class="my-5">
      <template #header>
        <h1 class="text-xl font-bold">作った人</h1>
        <NuxtLink
          class="text-blue-600 underline hover:no-underline"
          to="https://wefma.net"
          target="_blank"
        >
          ゑふまいか
        </NuxtLink>
      </template>
    </UCard>
  </UContainer>
</template>
