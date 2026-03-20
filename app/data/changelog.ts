export type ChangelogEntry = {
  date: string;
  change: string;
};

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "2026-03-20",
    change:
      "更新履歴ページを追加した。スマホでホーム画面にピン止めするとネット接続が不安定な環境でも見られるようになった。",
  },
  {
    date: "2026-02-26",
    change: "作成",
  },
];
