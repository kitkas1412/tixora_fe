/** 2500000 → "2.500.000đ" */
export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

/** 522 → "08:42" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
