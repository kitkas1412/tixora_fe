import { formatVND } from "@/shared/lib/format";
import type { SaleStatus } from "@/shared/kernel/sale";
import type { TierKey } from "@/shared/kernel/tier";
import { buildSeatsHref, type CheckoutParams } from "@/shared/routing/flow-urls";
import type { CheckoutOrder } from "@/modules/booking/model/order";
import { computeTotals } from "@/modules/booking/model/totals";

/** Phần dữ liệu sự kiện mà booking cần (EventItem của catalog thoả mãn về cấu trúc). */
export type BookableEvent = {
  slug: string;
  tiers: readonly { key: TierKey; name: string; price: number; status: SaleStatus }[];
};

export type CheckoutLine = { key: TierKey; name: string; price: number; quantity: number };

/**
 * Đối chiếu tham số /checkout với sự kiện: mọi hạng phải tồn tại và đang mở bán (on-sale/low).
 * Trả null nếu sai (trang hiển thị trạng thái "Không tìm thấy đơn hàng").
 */
export function resolveCheckout(params: CheckoutParams, event: BookableEvent): { order: CheckoutOrder; lines: CheckoutLine[] } | null {
  if (params.slug !== event.slug) return null;
  const entries: [TierKey, number][] = params.kind === "seats"
    ? [[params.zone, params.seats.length]]
    : (Object.entries(params.quantities) as [TierKey, number][]);
  const lines: CheckoutLine[] = [];
  for (const [key, quantity] of entries) {
    const tier = event.tiers.find((t) => t.key === key);
    if (!tier || (tier.status !== "on-sale" && tier.status !== "low")) return null;
    lines.push({ key, name: tier.name, price: tier.price, quantity });
  }
  return { order: params, lines };
}

/** Phần dữ liệu sự kiện hiển thị trên màn thanh toán (EventItem của catalog thoả mãn về cấu trúc). */
export type CheckoutEvent = { title: string; day: string; month: string; showtime: string };

export type CheckoutModel = {
  order: CheckoutOrder;
  title: string;
  /** "06.12 · 19:30 · VIP · C-06, C-07" */
  detail: string;
  swatch: TierKey;
  count: number;
  /** "2 × 2.500.000đ" */
  breakdown: string;
  total: number;
  totalText: string;
  /** Quay lại chọn ghế (đơn ghế) hoặc trang sự kiện (đơn theo hạng). */
  backHref: string;
};

/** Dữ liệu màn thanh toán từ đơn đã đối chiếu (kết quả của resolveCheckout). */
export function toCheckoutModel({ order, lines }: { order: CheckoutOrder; lines: CheckoutLine[] }, event: CheckoutEvent): CheckoutModel {
  const date = `${event.day}.${event.month}`;

  const totals = computeTotals(lines);
  const breakdown = `${lines.map((l) => `${l.quantity} × ${formatVND(l.price)}`).join(" + ")}`;
  const tierText = lines.map((l) => (order.kind === "tiers" ? `${l.name} × ${l.quantity}` : l.name)).join(", ");
  const detail = [date, event.showtime, tierText, order.kind === "seats" ? order.seats.join(", ") : null].filter(Boolean).join(" · ");

  return {
    order,
    title: event.title,
    detail,
    swatch: lines[0].key,
    count: totals.count,
    breakdown,
    total: totals.total,
    totalText: formatVND(totals.total),
    backHref: order.kind === "seats" ? buildSeatsHref(order.slug, { zone: order.zone }) : `/events/${encodeURIComponent(order.slug)}`,
  };
}
