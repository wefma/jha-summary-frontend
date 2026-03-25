<template>
  <UContainer>
    <UCard class="my-5">
      <template #header>
        <h1 class="text-xl font-bold">概要</h1>
      </template>
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
        <a class="font-bold"> 日本ハイスコア協会とは一切関係がありません。 </a>
      </p>
      <p>そのため予告なくサービスを停止する可能性があります。</p>
    </UCard>
    <UCard class="mb-5">
      <template #header>
        <h2 class="text-lg font-bold">このページの仕組み</h2>
      </template>
      <div class="mb-5">
        <p>
          日本ハイスコア協会が管理しているGoogleスプレッドシートからデータを毎月1日に定期的に取得し表示します。
        </p>
        <p>
          Googleスプレッドシート上のゲーム名や部門名の表記揺れによって
          まとめて表示すべきものを誤って分けて表示してしまう可能性があります。
          余力があれば直しますが直っていない可能性もあるのでご了承ください。
        </p>
      </div>
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
