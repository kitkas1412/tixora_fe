import type { CheckoutParams } from "@/shared/routing/flow-urls";

/** Đơn checkout: cùng hình dạng với tham số URL /checkout (sau khi đã đối chiếu với sự kiện). */
export type CheckoutOrder = CheckoutParams;

/** Mã đơn demo, VD "TXR-7K2M9Q". Gọi ở client (dùng Math.random). */
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `TXR-${s}`;
}
