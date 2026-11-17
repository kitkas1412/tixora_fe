import { TIER_KEYS, type TierKey } from "@/shared/kernel/tier";
import type { CheckoutParams, TicketParams } from "@/shared/routing/flow-urls";

/** Vé đã phát hành: cùng hình dạng với tham số URL /tickets/<code>. */
export type TicketSummary = TicketParams;

/**
 * Chuyển đơn checkout thành TicketSummary đã thanh toán (đơn ghế -> quantities = {zone: n}).
 * Nhận hợp đồng URL dùng chung (CheckoutParams), không phụ thuộc module booking.
 */
export function orderToTicketSummary(o: CheckoutParams, code: string): TicketSummary {
  return o.kind === "seats"
    ? { code, slug: o.slug, quantities: { [o.zone]: o.seats.length }, seats: o.seats, paid: true }
    : { code, slug: o.slug, quantities: o.quantities, seats: [], paid: true };
}

/** Mỗi vé một mục theo thứ tự SVIP -> CAT2: dùng cho "Vé 1 / 2". */
export function expandTickets(s: Pick<TicketSummary, "quantities" | "seats">): { tier: TierKey; seat?: string }[] {
  const out: { tier: TierKey; seat?: string }[] = [];
  for (const k of TIER_KEYS) for (let i = 0; i < (s.quantities[k] ?? 0); i++) out.push({ tier: k, seat: s.seats[out.length] });
  return out;
}

export type TicketModel = {
  tier: TierKey;
  /** Mã hiển thị trên vé, duy nhất cho từng vé. */
  code: string;
  facts: { label: string; value: string }[];
};

/** Phần dữ liệu sự kiện mà màn vé cần (EventItem của catalog thoả mãn về cấu trúc). */
export type TicketEvent = {
  title: string;
  genre: string;
  subtitle: string;
  dateLabel: string;
  doors: string;
  venue: string;
  city: string;
  tiers: readonly { key: TierKey; name: string }[];
};

export type TicketViewModel = { title: string; category: string; tickets: TicketModel[]; mapsHref: string; justPaid?: boolean };

/** Cổng vào demo theo hạng vé (dữ liệu minh hoạ). */
const GATE: Record<TierKey, string> = { svip: "A1", vip: "B2", cat1: "C3", cat2: "D4" };

/** Dữ liệu màn "Vé của tôi": mỗi vé một thẻ (mã -1, -2… khi đơn có nhiều vé). */
export function buildTicketView(summary: TicketSummary, event: TicketEvent): TicketViewModel {
  const names = Object.fromEntries(event.tiers.map((t) => [t.key, t.name]));
  const list = expandTickets(summary);
  const tickets: TicketModel[] = list.map(({ tier, seat }, i) => {
    const [row, num] = seat ? seat.split("-") : [];
    return {
      tier,
      code: list.length > 1 ? `${summary.code}-${i + 1}` : summary.code,
      facts: [
        { label: "NGÀY", value: `${event.dateLabel}` },
        { label: "MỞ CỔNG", value: event.doors },
        { label: "CỔNG · KHU", value: `${GATE[tier]} · ${names[tier] ?? tier.toUpperCase()}` },
        { label: "HÀNG · GHẾ", value: seat ? `${row} · ${num}` : "Tự do" },
      ],
    };
  });

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}`)}`;
  return { title: event.title.replace(/-/g, "‑"), category: `${event.genre} · ${event.subtitle}`, tickets, mapsHref, justPaid: summary.paid };
}
