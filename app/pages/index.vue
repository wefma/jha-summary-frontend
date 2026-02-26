<script setup lang="ts">
import { getGroupedRowModel } from "@tanstack/vue-table";
import type { GroupingOptions, CellContext } from "@tanstack/vue-table";
const config = useRuntimeConfig();

const { data: root, error } = useAsyncData(
  "jha",
  () => $fetch<any>(config.public.api),
  { server: false },
);

type RecordItem = {
  score: string;
  score_name: string;
  notes: string;
  game_center: string;
  date: string;
};

type Machines = Record<string, Record<string, RecordItem[]>>;
type Root = Record<string, Machines>;

const groupedLeafCell =
  (columnId: keyof RecordItem) =>
  ({ row, getValue }: CellContext<RecordItem, string>) => {
    if (row.getIsGrouped()) {
      if (row.groupingColumnId === "department") {
        const [firstLeaf] = row.getLeafRows();
        return firstLeaf?.original[columnId] ?? "";
      }
      return "";
    }
    return getValue();
  };

function buildTableData(data: Root): any[] {
  return Object.entries(data ?? {}).flatMap(([game, machines]) =>
    Object.entries(machines).flatMap(([department, records]) =>
      (Array.isArray(records) ? records : []).map((record) => ({
        game,
        department,
        ...record,
      })),
    ),
  );
}

const columnFilters = ref([
  {
    id: "game",
    value: "",
  },
]);

const table = useTemplateRef("table");

const PAGE_SIZE = 10;
const page = ref(1);

const jhaSummary = computed<Root>(() => root.value?.jha_summary ?? {});

const gameFilter = computed(() => {
  const filter = columnFilters.value.find((item) => item.id === "game");
  return typeof filter?.value === "string" ? filter.value : "";
});

const filteredGameEntries = computed<[string, Machines][]>(() => {
  const entries = Object.entries(jhaSummary.value);
  if (!gameFilter.value) {
    return entries;
  }

  const keyword = gameFilter.value.toLowerCase();
  return entries.filter(([game]) => game.toLowerCase().includes(keyword));
});

const totalGames = computed(() => filteredGameEntries.value.length);

const totalPages = computed(() =>
  totalGames.value === 0 ? 1 : Math.ceil(totalGames.value / PAGE_SIZE),
);

const paginatedGames = computed<[string, Machines][]>(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return filteredGameEntries.value.slice(start, start + PAGE_SIZE);
});

watch(
  totalPages,
  (newTotal) => {
    if (newTotal <= 0) {
      page.value = 1;
      return;
    }
    page.value = Math.min(Math.max(page.value, 1), newTotal);
  },
  { immediate: true },
);

watch(
  () => totalGames.value,
  () => {
    page.value = 1;
  },
);

const rows = computed(() =>
  buildTableData(Object.fromEntries(paginatedGames.value) as Root),
);
const updatedAt = ref(
  computed(() => {
    const dateStr = root.value?.updated_at;
    if (typeof dateStr === "string") {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString("ja-JP");
      }
    }
    return "不明";
  }),
);
const columns = [
  {
    id: "title",
    header: "部門",
  },
  { accessorKey: "game", header: "ゲーム名" },
  {
    accessorKey: "department",
    header: "機体",
    cell: ({ row }: CellContext<RecordItem, string>) =>
      row.getIsGrouped()
        ? `${row.getValue("department")}部門`
        : row.getValue("department"),
  },
  {
    accessorKey: "score",
    header: "スコア",
    cell: groupedLeafCell("score"),
  },
  {
    accessorKey: "score_name",
    header: "プレイヤー",
    cell: groupedLeafCell("score_name"),
  },
  {
    accessorKey: "date",
    header: "日付",
    cell: groupedLeafCell("date"),
  },
  {
    accessorKey: "notes",
    header: "備考",
    cell: groupedLeafCell("notes"),
  },
];
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel(),
});
</script>

<template>
  <UContainer>
    <UCard class="my-5">
      <template #header>
        <h1 class="text-xl font-bold">ようこそ</h1>
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
      <USeparator />
      <p class="text-sm m-2">最終更新日時: {{ updatedAt }}</p>
    </UCard>

    <ClientOnly>
      <UInput
        :model-value="
          table?.tableApi?.getColumn('game')?.getFilterValue() as string
        "
        class="max-w-sm"
        placeholder="ゲーム名で絞り込み"
        @update:model-value="
          table?.tableApi?.getColumn('game')?.setFilterValue($event)
        "
      />

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        :data="rows"
        :columns="columns"
        :grouping="['game', 'department']"
        :grouping-options="grouping_options"
        :ui="{
          root: 'min-w-full',
          td: 'empty:p-0', // helps with the colspaned row added for expand slot
        }"
      >
        <template #title-cell="{ row }">
          <div v-if="row.getIsGrouped()" class="flex items-center">
            <span
              class="inline-block"
              :style="{ width: `calc(${row.depth} * 1rem)` }"
            />

            <UButton
              variant="outline"
              color="neutral"
              class="mr-2"
              size="xs"
              @click="row.toggleExpanded()"
              ><p v-if="row.getIsExpanded()">-</p>
              <p v-else>+</p></UButton
            >
            <strong v-if="row.groupingColumnId === 'game'">{{
              row.getValue("game")
            }}</strong>
            <UBadge
              v-else-if="row.groupingColumnId === 'department'"
              class="capitalize"
              variant="subtle"
            >
              {{ row.getValue("department") }}
            </UBadge>
          </div>
        </template>
      </UTable>
      <div v-if="totalGames > PAGE_SIZE" class="flex justify-center mt-6">
        <UPagination
          v-model:page="page"
          :total="totalGames"
          :items-per-page="PAGE_SIZE"
          show-edges
        >
          <template #first>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              label="<<"
              class="min-w-5"
            />
          </template>
          <template #prev>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              label="<"
              class="min-w-5"
            />
          </template>
          <template #next>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              label=">"
              class="min-w-5"
            />
          </template>
          <template #last>
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              label=">>"
              class="min-w-5"
            />
          </template>
          <template #ellipsis>
            <UButton
              as="div"
              color="neutral"
              variant="outline"
              size="sm"
              label="…"
            />
          </template>
        </UPagination>
      </div>
    </ClientOnly>
  </UContainer>
</template>
