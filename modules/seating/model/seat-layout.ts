import type { TierKey } from "@/shared/kernel/tier";

export type Seat = { id: string; label: string; status: "available" | "taken" | "accessible" };
export type SeatRowData = { row: string; seats: Seat[]; /** chỉ số ghế bắt đầu lối đi */ aisleAfter?: number };

/** Sơ đồ ghế demo, xác định (không ngẫu nhiên): cùng khu luôn ra cùng sơ đồ nên SSR và client khớp nhau. */
const LAYOUT: Record<TierKey, { rows: number; seatsPerRow: number; taken: number }> = {
  svip: { rows: 4, seatsPerRow: 10, taken: 100 },
  vip: { rows: 6, seatsPerRow: 12, taken: 20 },
  cat1: { rows: 8, seatsPerRow: 12, taken: 30 },
  cat2: { rows: 10, seatsPerRow: 12, taken: 40 },
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 100;
}

/** Mã ghế dạng "C-06" (khớp định dạng parse trong shared/routing/flow-urls). */
export const seatId = (row: string, n: number) => `${row}-${String(n).padStart(2, "0")}`;

export function getSeatRows(zone: TierKey): SeatRowData[] {
  const { rows, seatsPerRow, taken } = LAYOUT[zone];
  return Array.from({ length: rows }, (_, r) => {
    const row = LETTERS[r];
    return {
      row,
      aisleAfter: Math.floor(seatsPerRow / 2), // SeatMap đặt khoảng cách TRƯỚC ghế có chỉ số này: lối đi sau ghế số 6
      seats: Array.from({ length: seatsPerRow }, (_, i) => {
        const id = seatId(row, i + 1);
        const wheelchair = r === rows - 1 && (i === 0 || i === seatsPerRow - 1);
        const status: "available" | "taken" | "accessible" = wheelchair ? "accessible" : hash(`${zone}:${id}`) < taken ? "taken" : "available";
        return { id, label: String(i + 1), status };
      }),
    };
  });
}

/** Số ghế còn trống thật trên sơ đồ (không tính ghế đã bán). */
export const countFreeSeats = (rows: SeatRowData[]) => rows.reduce((n, r) => n + r.seats.filter((s) => s.status !== "taken").length, 0);
