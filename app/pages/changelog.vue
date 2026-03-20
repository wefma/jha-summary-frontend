<script setup lang="ts">
import { changelogEntries } from "~/data/changelog";
</script>

<template>
  <UContainer class="py-8">
    <UCard>
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-bold">更新履歴</h1>
        </div>
      </template>

      <ul class="space-y-4">
        <li
          v-for="(entry, index) in changelogEntries"
          :key="`${entry.date}-${index}`"
          class="rounded-lg border border-default p-4"
        >
          <p class="text-sm text-muted">
            {{ entry.date }}
          </p>
          <p class="mt-2 text-base text-toned">
            {{ entry.change }}
          </p>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>
