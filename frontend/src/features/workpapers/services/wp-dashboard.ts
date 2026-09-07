import type { TodWorkpaperPack } from "@/types/domain";

export function todWorkpaperDashboardCounts(pack?: TodWorkpaperPack): {
  completed: number;
  total: number;
} {
  if (!pack) {
    return { completed: 0, total: 0 };
  }

  return {
    completed: pack.fileSignOff ? 1 : 0,
    total: 1,
  };
}
