export type TierKey = "svip" | "vip" | "cat1" | "cat2";

/** Số vé tối đa mỗi đơn; URL bị cắt về giới hạn này khi parse. */
export const MAX_TICKETS = 4;

export const TIER_KEYS: readonly TierKey[] = ["svip", "vip", "cat1", "cat2"];
export type TierQuantities = Partial<Record<TierKey, number>>;

export const countTickets = (q: TierQuantities): number => TIER_KEYS.reduce((n, k) => n + (q[k] ?? 0), 0);
