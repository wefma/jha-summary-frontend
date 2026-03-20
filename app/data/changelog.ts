export type ChangelogEntry = {
  date: string;
  change: string;
};

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-03-20",
    change:
      "更新履歴ページを追加した。データのキャッシュを12時間持つようにした。",
  },
  {
    date: "2026-02-26",
    change: "作成",
  },
];
