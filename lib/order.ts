import { getEvent } from "./data";
import type { TierKey } from "./types";

export const MAX_TICKETS = 4;
export const HOLD_MINUTES = 10;
export const HOLD_SECONDS = HOLD_MINUTES * 60;

/*
 * URL contract (tất cả tham số đều tuỳ chọn khi parse; parse* trả null nếu thiếu/sai):
 *   /events/[slug]/seats?zone=vip
 *   /checkout?event=<slug>&zone=vip&seats=C-06,C-07&hold=<epoch ms hết hạn>     (chọn ghế)
 *   /checkout?event=<slug>&q=vip.2,cat1.1&hold=<epoch ms hết hạn>               (chọn số lượng theo hạng)
 *   /tickets/<code>?event=<slug>&q=vip.2&seats=C-06,C-07[&paid=1]   (paid=1 chỉ khi vừa thanh toán xong)
 * Giá niêm yết đã gồm phí dịch vụ: tổng tiền = Σ giá × số lượng, không cộng thêm phí.
 */

export const TIER_KEYS: readonly TierKey[] = ["svip", "vip", "cat1", "cat2"];
export type TierQuantities = Partial<Record<TierKey, number>>;
export type SearchParamsInput = URLSearchParams | Record<string, string | string[] | undefined>;

const SEAT_RE = /^[A-Z]{1,2}-\d{1,3}$/;
const CODE_RE = /^[A-Z0-9-]{4,24}$/;

function get(sp: SearchParamsInput, key: string): string | undefined {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? undefined;
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}
const isTier = (v: unknown): v is TierKey => typeof v === "string" && (TIER_KEYS as readonly string[]).includes(v);
const tierParam = (sp: SearchParamsInput, key: string): TierKey | undefined => { const v = get(sp, key); return isTier(v) ? v : undefined; };
const slugParam = (sp: SearchParamsInput): string | undefined => { const v = get(sp, "event"); return v && getEvent(v) ? v : undefined; };

function parseSeats(raw: string | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  for (const s of raw.split(",")) { const t = s.trim().toUpperCase(); if (SEAT_RE.test(t)) seen.add(t); }
  return [...seen].slice(0, MAX_TICKETS);
}

/** "vip.2,cat1.1" -> {vip:2,cat1:1}; bỏ qua mục sai; tổng bị cắt về MAX_TICKETS. */
export function parseQuantities(raw: string | undefined): TierQuantities {
  const out: TierQuantities = {};
  let total = 0;
  for (const part of (raw ?? "").split(",")) {
    const [k, n] = part.split(".");
    const q = Math.floor(Number(n));
    if (!isTier(k) || !Number.isFinite(q) || q <= 0 || out[k]) continue;
    const take = Math.min(q, MAX_TICKETS - total);
    if (take <= 0) break;
    out[k] = take; total += take;
  }
  return out;
}
export function quantitiesToParam(q: TierQuantities): string {
  return TIER_KEYS.filter((k) => (q[k] ?? 0) > 0).map((k) => `${k}.${q[k]}`).join(",");
}
export const countTickets = (q: TierQuantities): number => TIER_KEYS.reduce((n, k) => n + (q[k] ?? 0), 0);

function href(path: string, params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const qs = sp.toString().replace(/%2C/gi, ",");
  return qs ? `${path}?${qs}` : path;
}

/** Hạn giữ vé (epoch ms) tính từ bây giờ. Gọi ở client khi người dùng bấm. */
export const newHoldExpiry = (now: number = Date.now()): number => now + HOLD_MINUTES * 60_000;
export { holdSecondsLeft } from "./format";

/* --- event -> seats --- */
export type SeatsParams = { zone?: TierKey };
export const buildSeatsHref = (slug: string, p: SeatsParams = {}): string => href(`/events/${encodeURIComponent(slug)}/seats`, { zone: p.zone });
export const parseSeatsParams = (sp: SearchParamsInput): SeatsParams => ({ zone: tierParam(sp, "zone") });

/* --- seats -> checkout (có ghế) và tier quantities -> checkout (không ghế) --- */
export type CheckoutOrder =
  | { kind: "seats"; slug: string; zone: TierKey; seats: string[]; holdExpiresAt: number | null }
  | { kind: "tiers"; slug: string; quantities: TierQuantities; holdExpiresAt: number | null };

export function buildCheckoutHref(o: CheckoutOrder): string {
  const hold = o.holdExpiresAt ? String(Math.floor(o.holdExpiresAt)) : undefined;
  return o.kind === "seats"
    ? href("/checkout", { event: o.slug, zone: o.zone, seats: o.seats.slice(0, MAX_TICKETS).join(","), hold })
    : href("/checkout", { event: o.slug, q: quantitiesToParam(o.quantities), hold });
}

export function parseCheckoutParams(sp: SearchParamsInput): CheckoutOrder | null {
  const slug = slugParam(sp);
  if (!slug) return null;
  const holdRaw = Number(get(sp, "hold"));
  const holdExpiresAt = Number.isFinite(holdRaw) && holdRaw > 0 ? holdRaw : null;
  const zone = tierParam(sp, "zone");
  const seats = parseSeats(get(sp, "seats"));
  if (zone && seats.length) return { kind: "seats", slug, zone, seats, holdExpiresAt };
  const quantities = parseQuantities(get(sp, "q"));
  if (countTickets(quantities) > 0) return { kind: "tiers", slug, quantities, holdExpiresAt };
  return null;
}

/* --- checkout -> ticket --- */
export type TicketSummary = { code: string; slug: string; quantities: TierQuantities; seats: string[]; paid?: boolean };

export function buildTicketHref(s: TicketSummary): string {
  return href(`/tickets/${encodeURIComponent(s.code)}`, {
    event: s.slug, q: quantitiesToParam(s.quantities), seats: s.seats.join(","), paid: s.paid ? "1" : undefined,
  });
}

export function parseTicketParams(code: string, sp: SearchParamsInput): TicketSummary | null {
  const c = decodeURIComponent(code).toUpperCase();
  const slug = slugParam(sp);
  if (!CODE_RE.test(c) || !slug) return null;
  const quantities = parseQuantities(get(sp, "q"));
  if (countTickets(quantities) === 0) return null;
  const seats = parseSeats(get(sp, "seats"));
  return { code: c, slug, quantities, seats: seats.length === countTickets(quantities) ? seats : [], paid: get(sp, "paid") === "1" };
}

/** Chuyển đơn checkout thành TicketSummary đã thanh toán (đơn ghế -> quantities = {zone: n}). */
export function orderToTicketSummary(o: CheckoutOrder, code: string): TicketSummary {
  return o.kind === "seats"
    ? { code, slug: o.slug, quantities: { [o.zone]: o.seats.length }, seats: o.seats, paid: true }
    : { code, slug: o.slug, quantities: o.quantities, seats: [], paid: true };
}

/** Mỗi vé một mục theo thứ tự SVIP -> CAT2: dùng cho "Vé 1 / 2". */
export function expandTickets(s: TicketSummary): { tier: TierKey; seat?: string }[] {
  const out: { tier: TierKey; seat?: string }[] = [];
  for (const k of TIER_KEYS) for (let i = 0; i < (s.quantities[k] ?? 0); i++) out.push({ tier: k, seat: s.seats[out.length] });
  return out;
}

/** Mã đơn demo, VD "TXR-7K2M9Q". Gọi ở client (dùng Math.random). */
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `TXR-${s}`;
}

/** Link "Vé của tôi" dùng dữ liệu demo cố định. */
export const DEMO_TICKET_HREF = buildTicketHref({
  code: "TXR-7K2M9Q", slug: "starlight-k-night-2026", quantities: { vip: 2 }, seats: ["C-06", "C-07"],
});

/* --- tổng tiền --- */
export type PriceLine = { price: number; quantity: number };
/** Giá đã gồm phí dịch vụ: total = Σ price × quantity, không cộng phí nào khác. */
export function computeTotals(lines: PriceLine[]): { count: number; total: number } {
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const total = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { count, total };
}
